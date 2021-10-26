"use strict";

const {
    NotFoundError,
    BadRequestError,
} = require("../expressError");
const db = require("../db.js");
const Park = require("./park.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

const newPark = {
    parkCode: 'test3',
    fullName: 'testPark1',
    description: 'Test Park1',
    states: 'TX',
    designation: 'testDesignation1',
    latitude: '123',
    longitude: '123',
    directionsInfo: 'testDirections1',
    weatherInfo: 'testWeather1',
    entranceFees: [{
        "cost": "123",
        "description": "test_description",
        "title": "test_title"
    }],
    activities: [{ id: "act1", name: "activity1" }, { id: "act2", name: "activity2" }],
    topics: [{ id: "top1", name: "topic1" }, { id: "top2", name: "topic2" }],
    images: [
        {
            credit: "credit1", title: "title1", altText: "altText1",
            caption: "caption1", url: "url1", parkCode: "test3"
        },
        {
            credit: "credit2", title: "title2", altText: "altText2",
            caption: "caption2", url: "url2", parkCode: "test3"
        },
    ]
}

/************************************** addPark */

describe("addPark", function () {
    test("works", async function () {
        let park = await Park.addPark(newPark);
        expect(park).toEqual({ parkCode: newPark.parkCode });
        const found = await db.query(`SELECT * FROM parks WHERE "parkCode" = 'test3'`);
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].fullName).toEqual(newPark.fullName);
        expect(found.rows[0].directionsInfo).toEqual(newPark.directionsInfo);
    });

    test("adds generic info if no entranceFees", async function () {
        const newPark2 = { ...newPark }
        newPark2.entranceFees = [];
        let park = await Park.addPark(newPark2);
        expect(park).toEqual({ parkCode: newPark2.parkCode });
        const found = await db.query(`SELECT * FROM parks WHERE "parkCode" = 'test3'`);
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].fullName).toEqual(newPark2.fullName);
        expect(found.rows[0].directionsInfo).toEqual(newPark2.directionsInfo);
        expect(found.rows[0].cost).toEqual("N/A");
        expect(found.rows[0].cost_description).toEqual("Our records don't show this accurately, please check with park for more information");
    });

    test("Doesn't fail with dupicate data", async function () {
        try {
            await Park.addPark(newPark);
            const res = await Park.addPark(newPark);
            expect(res).toEqual(newPark.parkCode)
        } catch (err) {
            expect(err instanceof BadRequestError).toBeFalsy();
        }
    });

});

/************************************** findAllDB */

describe("findAllDB", function () {
    test("works", async function () {
        const parks = await Park.findAllDB();
        expect(parks).toEqual([
            {
                "parkCode": "test1",
            },
            {
                "parkCode": "test2",
            },
        ]);
    });
});

/************************************** getByParkCode */

describe("getByParkCode", function () {
    test("works", async function () {
        await Park.addPark(newPark);
        let park = await Park.getByParkCode(newPark.parkCode);
        expect(park).toEqual({
            "activities": [
                {
                    "id": "act1",
                    "name": "activity1",
                },
                {
                    "id": "act2",
                    "name": "activity2",
                },
            ],
            "cost": "123",
            "cost_description": "test_description",
            "description": "Test Park1",
            "designation": "testDesignation1",
            "directionsInfo": "testDirections1",
            "email": null,
            "fullName": "testPark1",
            "images": [
                {
                    "alttext": "altText1",
                    "caption": "caption1",
                    "comment": null,
                    "credit": "credit1",
                    "id": expect.any(Number),
                    "parkCode": "test3",
                    "title": "title1",
                    "url": "url1",
                    "user_id": null,
                },
                {
                    "alttext": "altText2",
                    "caption": "caption2",
                    "comment": null,
                    "credit": "credit2",
                    "id": expect.any(Number),
                    "parkCode": "test3",
                    "title": "title2",
                    "url": "url2",
                    "user_id": null,
                },
            ],
            "latitude": "123",
            "longitude": "123",
            "parkCode": "test3",
            "phone": null,
            "states": "TX",
            "topics": [
                {
                    "id": "top1",
                    "name": "topic1",
                },
                {
                    "id": "top2",
                    "name": "topic2",
                },
            ],
            "weatherInfo": "testWeather1",
        });
    });

    test("not found if no such park", async function () {
        try {
            await Park.getByParkCode("nope");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** getParkByTopic */

describe("getParkByTopic", function () {
    test("works", async function () {
        await Park.addPark(newPark);
        let park = await Park.getParkByTopic("top1");
        expect(park).toEqual([{ parkCode: newPark.parkCode }]);
    });
    test("returns empty if topic doesn't exist or no parks are with that topic", async function () {
        let park = await Park.getParkByTopic("nope");
        expect(park).toEqual([]);
        let park2 = await Park.getParkByTopic("t1");
        expect(park2).toEqual([]);
    });
});

/************************************** getParkByActivity */

describe("getParkByActivity", function () {
    test("works", async function () {
        await Park.addPark(newPark);
        let park = await Park.getParkByActivity("act1");
        expect(park).toEqual([{ parkCode: newPark.parkCode }]);
    });
    test("returns empty if activity doesn't exist or no parks are with that activity", async function () {
        let park = await Park.getParkByTopic("nope");
        expect(park).toEqual([]);
        let park2 = await Park.getParkByTopic("a1");
        expect(park2).toEqual([]);
    });
});

/************************************** getRandom */

describe("getRandom", function () {
    test("works", async function () {
        let park = await Park.getRandom();
        expect(['test1', 'test2']).toContain(park[0].parkCode)
    });
});

/************************************** searchDB */

describe("searchDB", function () {
    test("works with state", async function () {
        const query = { states: 'TX', query: '', limit: 100 };
        let park = await Park.searchDB(query);
        expect(park).toEqual([{ parkCode: 'test1' }]);
    });
    test("empty if state is wrong", async function () {
        const query = { states: 'blue', query: '', limit: 100 };
        let park = await Park.searchDB(query);
        expect(park).toEqual([]);
    });
    test("searches description", async function () {
        const query = { states: '', query: 'description', limit: 100 };
        let park = await Park.searchDB(query);
        expect(park).toEqual([{ parkCode: 'test1' }]);
    });
    test("searches name", async function () {
        const query = { states: '', query: 'name', limit: 100 };
        let park = await Park.searchDB(query);
        expect(park).toEqual([{ parkCode: 'test2' }]);
    });
    test("returns all if everything is blank up to limit", async function () {
        const query = { states: '', query: '', limit: 100 };
        let park = await Park.searchDB(query);
        expect(park).toEqual([{ parkCode: 'test2' }, { parkCode: 'test1' }]);
        query.limit = 1;
        let park2 = await Park.searchDB(query);
        expect(park2).toEqual([{ parkCode: 'test2' }]);
    });
});
