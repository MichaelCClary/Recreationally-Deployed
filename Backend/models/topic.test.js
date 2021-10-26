"use strict";

const {
  BadRequestError,
} = require("../expressError");
const db = require("../db.js");
const Topic = require("./topic.js");
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


/**************************************addTopictoDB  */

describe("addTopictoDB", function () {
  const newTopic = {
    name: "newTopic",
    id: "newTopicID",
  };

  test("works", async function () {
    let topic = await Topic.addTopictoDB(newTopic.id, newTopic.name);
    expect(topic).toEqual(newTopic);
    const found = await db.query("SELECT * FROM topics WHERE id = 'newTopicID'");
    expect(found.rows.length).toEqual(1);
    expect(found.rows[0].name).toEqual(newTopic.name);
  });


  test("Doesn't fail with dupicate data", async function () {
    try {
      await Topic.addTopictoDB(newTopic.id, newTopic.name);
      const res = await Topic.addTopictoDB(newTopic.id, newTopic.name);
      expect(res).toEqual(newTopic.id)
    } catch (err) {
      expect(err instanceof BadRequestError).toBeFalsy();
    }
  });
});


/************************************** getTopicsFromDB */

describe("getTopicsFromDB", function () {
  test("works", async function () {
    const topics = await Topic.getTopicsFromDB();
    expect(topics).toEqual([
      {
        id: "t1",
        name: "test_topic1",
      },
      {
        id: "t2",
        name: "test_topic2",
      },
    ]);
  });
});

/************************************** addTopicToPark */

describe("addTopicToPark", function () {
  test("works", async function () {
    const topics = await Topic.addTopicToPark("test1", "t1");
    expect(topics).toEqual([
      {
        "topic_id": "t1",
        "parkCode": "test1"
      },
    ]);
  });

  test("throws error if ntopicsk", async function () {
    try {
      await Topic.addTopicToPark("nope", "t1");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("throws error if no such topic", async function () {
    try {
      await Topic.addTopicToPark("test1", "nope");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("throws error if park already has topic", async function () {
    try {
      await Topic.addTopicToPark("test1", "t1");
      await Topic.addTopicToPark("test1", "t1");
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});