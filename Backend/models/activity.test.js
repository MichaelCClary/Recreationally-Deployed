"use strict";

const {
    BadRequestError,
} = require("../expressError");
const db = require("../db.js");
const Activity = require("./activity.js");
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


/**************************************addActivitytoDB  */

describe("addActivitytoDB", function () {
    const newActivity = {
        name: "newActivity",
        id: "newActivityID",
    };

    test("works", async function () {
        let activity = await Activity.addActivitytoDB(newActivity.id, newActivity.name);
        expect(activity).toEqual(newActivity);
        const found = await db.query("SELECT * FROM activities WHERE id = 'newActivityID'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].name).toEqual(newActivity.name);
    });


    test("Doesn't fail with dupicate data", async function () {
        try {
            await Activity.addActivitytoDB(newActivity.id, newActivity.name);
            const res = await Activity.addActivitytoDB(newActivity.id, newActivity.name);
            expect(res).toEqual(newActivity.id)
        } catch (err) {
            expect(err instanceof BadRequestError).toBeFalsy();
        }
    });
});


/************************************** getActivitiesFromDB */

describe("getActivitiesFromDB", function () {
    test("works", async function () {
        const activities = await Activity.getActivitiesFromDB();
        expect(activities).toEqual([
            {
                id: "a1",
                name: "test_activity1",
            },
            {
                id: "a2",
                name: "test_activity2",
            },
        ]);
    });
});

/************************************** addActivityToPark */

describe("addActivityToPark", function () {
    test("works", async function () {
        const activities = await Activity.addActivityToPark("test1", "a1");
        expect(activities).toEqual([
            {
                "activity_id": "a1",
                "parkCode": "test1",

            },
        ]);
    });

    test("throws error if no such park", async function () {
        try {
            await Activity.addActivityToPark("nope", "a1");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("throws error if no such activity", async function () {
        try {
            await Activity.addActivityToPark("test1", "nope");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("throws error if park already has activity", async function () {
        try {
            await Activity.addActivityToPark("test1", "a1");
            await Activity.addActivityToPark("test1", "a1");
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});