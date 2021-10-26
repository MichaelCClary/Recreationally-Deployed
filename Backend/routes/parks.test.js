"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const Activity = require("../models/activity");
const Topic = require("../models/topic");

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


/************************************** GET /parks */

describe("GET /parks", function () {
    test("works for all users", async function () {
        const resp = await request(app)
            .get("/parks")
        expect(resp.body).toEqual({
            parks: [
                {
                    "parkCode": "test1",
                },
                {
                    "parkCode": "test2",
                },
            ],
        });
    });
});

/************************************** GET /parks/:parkCode */

describe("GET /parks/:parkCode", function () {
    test("works for all users", async function () {
        const resp = await request(app)
            .get(`/parks/test1`)
        expect(resp.body).toEqual({
            park: {
                "activities": [],
                "cost": "testCost1",
                "cost_description": "testCost_description1",
                "description": "Test Park description",
                "designation": "testDesignation1",
                "directionsInfo": "testDirections1",
                "email": null,
                "fullName": "testPark1",
                "images": [],
                "latitude": "123",
                "longitude": "123",
                "parkCode": "test3",
                "phone": null,
                "states": "TX",
                "topics": [],
                "weatherInfo": "testWeather1",
                "parkCode": "test1",
            },
        });
    });

    test("not found if park not found", async function () {
        const resp = await request(app)
            .get(`/parks/nope`)
        expect(resp.statusCode).toEqual(404);
    });
});
/************************************** GET /parks/random */

describe("GET /parks/random", function () {
    test("works for all users - gives you a random park from DB", async function () {
        const resp = await request(app)
            .get(`/parks/random`)
        expect(resp.body).toEqual({ parks: expect.any(Object) });
    });
});

/************************************** GET /activities */

describe("GET /activities", function () {
    test("works for all users", async function () {
        const resp = await request(app)
            .get("/parks/activities")
        expect(resp.body).toEqual({
            activities: [
                {
                    "id": "a1",
                    "name": "test_activity1",
                },
                {
                    "id": "a2",
                    "name": "test_activity2",
                },
            ],
        });
    });
});

/************************************** GET /parks/activities/:id */

describe("GET /parks/activities/:id", function () {
    test("works for all users", async function () {
        await Activity.addActivityToPark("test1", "a1");
        const resp = await request(app)
            .get(`/parks/activities/a1`)
        expect(resp.body).toEqual({
            "parks": [
                {
                    "activities": [
                        {
                            "id": "a1",
                            "name": "test_activity1",
                        },
                    ],
                    "cost": "testCost1",
                    "cost_description": "testCost_description1",
                    "description": "Test Park description",
                    "designation": "testDesignation1",
                    "directionsInfo": "testDirections1",
                    "email": null,
                    "fullName": "testPark1",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test1",
                    "phone": null,
                    "states": "TX",
                    "topics": [],
                    "weatherInfo": "testWeather1",
                },
            ],
        });
    });

    test("returns empty for activity with no parks", async function () {
        const resp = await request(app)
            .get(`/parks/activities/a1`)
        expect(resp.body).toEqual({
            "parks": [],
        });
    });

    test("returns empty for invalid activity", async function () {
        const resp = await request(app)
            .get(`/parks/activities/nope`)
        expect(resp.body).toEqual({
            "parks": [],
        });
    });

});

/************************************** GET /topics */

describe("GET /topics", function () {
    test("works for all users", async function () {
        const resp = await request(app)
            .get("/parks/topics")
        expect(resp.body).toEqual({
            topics: [
                {
                    "id": "t1",
                    "name": "test_topic1",
                },
                {
                    "id": "t2",
                    "name": "test_topic2",
                },
            ],
        });
    });
});

/************************************** GET /parks/topics/:id */

describe("GET /parks/topics/:id", function () {
    test("works for all users", async function () {
        await Topic.addTopicToPark("test1", "t1");
        const resp = await request(app)
            .get(`/parks/topics/t1`)
        expect(resp.body).toEqual({
            "parks": [
                {
                    "topics": [
                        {
                            "id": "t1",
                            "name": "test_topic1",
                        },
                    ],
                    "cost": "testCost1",
                    "cost_description": "testCost_description1",
                    "description": "Test Park description",
                    "designation": "testDesignation1",
                    "directionsInfo": "testDirections1",
                    "email": null,
                    "fullName": "testPark1",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test1",
                    "phone": null,
                    "states": "TX",
                    "activities": [],
                    "weatherInfo": "testWeather1",
                },
            ],
        });
    });

    test("returns empty for topic with no parks", async function () {
        const resp = await request(app)
            .get(`/parks/topics/t1`)
        expect(resp.body).toEqual({
            "parks": [],
        });
    });

    test("returns empty for invalid topic", async function () {
        const resp = await request(app)
            .get(`/parks/topics/nope`)
        expect(resp.body).toEqual({
            "parks": [],
        });
    });
});
/************************************** GET /parks/search */

describe("GET /parks/search", function () {
    test("returns all up to limit if everything blank - max limit", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 100, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [
                {
                    "activities": [],
                    "cost": "testCost2",
                    "cost_description": "testCost_description2",
                    "description": "Test Park2",
                    "designation": "testDesignation2",
                    "directionsInfo": "testDirections2",
                    "email": null,
                    "fullName": "testParkname2",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test3",
                    "phone": null,
                    "states": "NY",
                    "topics": [],
                    "weatherInfo": "testWeather2",
                    "parkCode": "test2",
                },
                {
                    "activities": [],
                    "cost": "testCost1",
                    "cost_description": "testCost_description1",
                    "description": "Test Park description",
                    "designation": "testDesignation1",
                    "directionsInfo": "testDirections1",
                    "email": null,
                    "fullName": "testPark1",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test3",
                    "phone": null,
                    "states": "TX",
                    "topics": [],
                    "weatherInfo": "testWeather1",
                    "parkCode": "test1",
                },],
        });
    });

    test("returns all up to limit if everything blank - limit 1", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 1, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [{
                "activities": [],
                "cost": "testCost2",
                "cost_description": "testCost_description2",
                "description": "Test Park2",
                "designation": "testDesignation2",
                "directionsInfo": "testDirections2",
                "email": null,
                "fullName": "testParkname2",
                "images": [],
                "latitude": "123",
                "longitude": "123",
                "parkCode": "test3",
                "phone": null,
                "states": "NY",
                "topics": [],
                "weatherInfo": "testWeather2",
                "parkCode": "test2",
            }],
        });
    });

    test("works with only states", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: 'TX', query: '', limit: 100, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [{
                "activities": [],
                "cost": "testCost1",
                "cost_description": "testCost_description1",
                "description": "Test Park description",
                "designation": "testDesignation1",
                "directionsInfo": "testDirections1",
                "email": null,
                "fullName": "testPark1",
                "images": [],
                "latitude": "123",
                "longitude": "123",
                "parkCode": "test3",
                "phone": null,
                "states": "TX",
                "topics": [],
                "weatherInfo": "testWeather1",
                "parkCode": "test1",
            }],
        });
    });

    test("empty if state is invalid", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: 'purple', query: '', limit: 100, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [],
        });
    });

    test("works with only query for description", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: 'description', limit: 100, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [{
                "activities": [],
                "cost": "testCost1",
                "cost_description": "testCost_description1",
                "description": "Test Park description",
                "designation": "testDesignation1",
                "directionsInfo": "testDirections1",
                "email": null,
                "fullName": "testPark1",
                "images": [],
                "latitude": "123",
                "longitude": "123",
                "parkCode": "test3",
                "phone": null,
                "states": "TX",
                "topics": [],
                "weatherInfo": "testWeather1",
                "parkCode": "test1",
            }],
        });
    });

    test("works with only query for name", async function () {
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: 'name', limit: 100, activityID: '', topicID: '' }
            )
        expect(resp.body).toEqual({
            parks: [{
                "activities": [],
                "cost": "testCost2",
                "cost_description": "testCost_description2",
                "description": "Test Park2",
                "designation": "testDesignation2",
                "directionsInfo": "testDirections2",
                "email": null,
                "fullName": "testParkname2",
                "images": [],
                "latitude": "123",
                "longitude": "123",
                "parkCode": "test3",
                "phone": null,
                "states": "NY",
                "topics": [],
                "weatherInfo": "testWeather2",
                "parkCode": "test2",
            }],
        });
    });

    test("works with only activityID", async function () {
        await Activity.addActivityToPark("test1", "a1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 100, activityID: 'a1', topicID: '' }
            )
        expect(resp.body).toEqual({
            "parks": [
                {
                    "activities": [
                        {
                            "id": "a1",
                            "name": "test_activity1",
                        },
                    ],
                    "cost": "testCost1",
                    "cost_description": "testCost_description1",
                    "description": "Test Park description",
                    "designation": "testDesignation1",
                    "directionsInfo": "testDirections1",
                    "email": null,
                    "fullName": "testPark1",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test1",
                    "phone": null,
                    "states": "TX",
                    "topics": [],
                    "weatherInfo": "testWeather1",
                },
            ],
        });
    });

    test("blank with invalid activity ID", async function () {
        await Activity.addActivityToPark("test1", "a1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 100, activityID: 'a2', topicID: '' }
            )
        expect(resp.body).toEqual({
            "parks": [],
        });
    });

    test("works with only topicID", async function () {
        await Topic.addTopicToPark("test1", "t1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 100, activityID: '', topicID: 't1' }
            )
        expect(resp.body).toEqual({
            "parks": [
                {
                    "topics": [
                        {
                            "id": "t1",
                            "name": "test_topic1",
                        },
                    ],
                    "cost": "testCost1",
                    "cost_description": "testCost_description1",
                    "description": "Test Park description",
                    "designation": "testDesignation1",
                    "directionsInfo": "testDirections1",
                    "email": null,
                    "fullName": "testPark1",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test1",
                    "phone": null,
                    "states": "TX",
                    "activities": [],
                    "weatherInfo": "testWeather1",
                },
            ],
        });
    });

    test("blank with invalid topicID", async function () {
        await Topic.addTopicToPark("test1", "t1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: '', limit: 100, activityID: '', topicID: 't2' }
            )
        expect(resp.body).toEqual({
            "parks": [],
        });
    });

    test("works with query, activityID, and topicID", async function () {
        await db.query(`
        INSERT INTO parks("parkCode",
                          "fullName",
                          description,
                          states,
                          designation,
                          latitude,
                          longitude,
                          "directionsInfo",
                          "weatherInfo",
                          cost,
                          cost_description)
        VALUES ('test3', 'testParkname3', 'Test Park3', 'KY',
                 'testDesignation3', '123', '123', 'testDirections3', 
                 'testWeather3', 'testCost3', 'testCost_description3'),
               ('test4', 'testPark4', 'Test Park description', 'TX',
                 'testDesignation4', '123', '123', 'testDirections4', 
                 'testWeather4', 'testCost4', 'testCost_description4')
        RETURNING "parkCode"`);

        await Topic.addTopicToPark("test1", "t1");
        await Topic.addTopicToPark("test2", "t1");
        await Topic.addTopicToPark("test3", "t1");
        await Activity.addActivityToPark("test1", "a1");
        await Activity.addActivityToPark("test4", "a1");
        await Activity.addActivityToPark("test3", "a1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: '', query: 'name', limit: 100, activityID: 'a1', topicID: 't1' }
            )
        expect(resp.body).toEqual({
            "parks": [
                {
                    "activities": [
                        {
                            "id": "a1",
                            "name": "test_activity1",
                        },
                    ],
                    "cost": "testCost3",
                    "cost_description": "testCost_description3",
                    "description": "Test Park3",
                    "designation": "testDesignation3",
                    "directionsInfo": "testDirections3",
                    "email": null,
                    "fullName": "testParkname3",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test3",
                    "phone": null,
                    "states": "KY",
                    "weatherInfo": "testWeather3",
                    "topics": [
                        {
                            "id": "t1",
                            "name": "test_topic1",
                        },
                    ],
                },
            ],
        });
    });

    test("works with states, query, activityID, and topicID", async function () {
        await db.query(`
        INSERT INTO parks("parkCode",
                          "fullName",
                          description,
                          states,
                          designation,
                          latitude,
                          longitude,
                          "directionsInfo",
                          "weatherInfo",
                          cost,
                          cost_description)
        VALUES ('test3', 'testParkname3', 'Test Park3', 'TX',
                 'testDesignation3', '123', '123', 'testDirections3', 
                 'testWeather3', 'testCost3', 'testCost_description3'),
               ('test4', 'testPark4', 'Test Park description', 'TX',
                 'testDesignation4', '123', '123', 'testDirections4', 
                 'testWeather4', 'testCost4', 'testCost_description5'),
               ('test5', 'testPark5', 'Test Park description', 'KY',
                 'testDesignation5', '123', '123', 'testDirections5', 
                 'testWeather5', 'testCost5', 'testCost_description5'),
               ('test6', 'testPark6', 'Test Park', 'KY',
                 'testDesignation6', '123', '123', 'testDirections6', 
                 'testWeather6', 'testCost6', 'testCost_description6')
        RETURNING "parkCode"`);

        await Topic.addTopicToPark("test1", "t1");
        await Topic.addTopicToPark("test2", "t1");
        await Topic.addTopicToPark("test3", "t1");
        await Topic.addTopicToPark("test4", "t1");
        await Topic.addTopicToPark("test5", "t1");
        await Topic.addTopicToPark("test6", "t1");
        await Activity.addActivityToPark("test1", "a1");
        await Activity.addActivityToPark("test4", "a1");
        await Activity.addActivityToPark("test2", "a1");
        await Activity.addActivityToPark("test5", "a1");
        const resp = await request(app)
            .get(`/parks/search`)
            .query(
                { states: 'KY', query: 'description', limit: 100, activityID: 'a1', topicID: 't1' }
            )
        expect(resp.body).toEqual({
            "parks": [
                {
                    "activities": [
                        {
                            "id": "a1",
                            "name": "test_activity1",
                        },
                    ],
                    "cost": "testCost5",
                    "cost_description": "testCost_description5",
                    "description": "Test Park description",
                    "designation": "testDesignation5",
                    "directionsInfo": "testDirections5",
                    "email": null,
                    "fullName": "testPark5",
                    "images": [],
                    "latitude": "123",
                    "longitude": "123",
                    "parkCode": "test5",
                    "phone": null,
                    "states": "KY",
                    "weatherInfo": "testWeather5",
                    "topics": [
                        {
                            "id": "t1",
                            "name": "test_topic1",
                        },
                    ],
                },
            ],
        });
    });
});


