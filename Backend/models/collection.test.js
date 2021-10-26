"use strict";

const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const db = require("../db.js");
const User = require("./user.js");
const Collection = require("./collection.js")
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");
const { Restaurant } = require("@material-ui/icons");
const { responsiveFontSizes } = require("@material-ui/core");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** new */

describe("new", function () {
  test("works", async function () {
    let user = await User.get("u1");
    let newCollection = await Collection.new({ user_id: user.id, name: "testCollection" });
    expect(newCollection).toEqual({
      user_id: user.id,
      id: expect.any(Number),
      name: "testCollection"
    })
  });

  test("throws error if no such user", async function () {
    try {
      await Collection.new({ user_id: 0, name: "testCollection" });
      fail();
    } catch (err) {
      expect(err.code).toEqual("23503");
    }
  });

});
/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    let user = await User.get("u1");
    let newCollection = await Collection.new({ user_id: user.id, name: "testCollection" });
    await Collection.remove(newCollection.id);
    const res = await db.query(`SELECT * FROM collections WHERE id = ${newCollection.id}`);
    expect(res.rows.length).toEqual(0);
  });

  test("throws not found if no such collection", async function () {
    try {
      await Collection.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
/************************************** addParkToCollection */

describe("addParkToCollection", function () {
  test("works", async function () {
    let user = await User.get("u1");
    let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
    let response = await Collection.addParkToCollection({ parkCode: "test1", collection_id: collection.id })
    expect(response).toEqual([{
      parkCode: "test1",
      collection_id: collection.id,
    }])
  });

  test("throws error if no such park is already in collection", async function () {
    try {
      let user = await User.get("u1");
      let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
      await Collection.addParkToCollection({ parkCode: "test1", collection_id: collection.id });
      await Collection.addParkToCollection({ parkCode: "test1", collection_id: collection.id });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
  test("throws error if no such park", async function () {
    try {
      let user = await User.get("u1");
      let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
      await Collection.addParkToCollection({ parkCode: "notARealPark", collection_id: collection.id });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("throws error if no such collection", async function () {
    try {
      let user = await User.get("u1");
      await Collection.new({ user_id: user.id, name: "testCollection" });
      await Collection.addParkToCollection({ parkCode: "test1", collection_id: 0 });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** removeParkFromCollection */
describe("removeParkFromCollection", function () {
  test("works", async function () {
    let user = await User.get("u1");
    let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
    await Collection.addParkToCollection({ parkCode: "test1", collection_id: collection.id })
    await Collection.removeParkFromCollection(collection.id, "test1");
    const res = await Collection.getParksInCollection(collection.id)
    expect(res.length).toEqual(0);
  });

  test("throws not found if no such collection", async function () {
    try {
      await Collection.removeParkFromCollection(0, "test1");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("throws not found park is not in collection", async function () {
    try {
      let user = await User.get("u1");
      let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
      await Collection.removeParkFromCollection(collection.id, "test1");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

});


/************************************** getByUserId */

describe("getByUserId", function () {
  test("works", async function () {
    let user = await User.get("u1");
    let collection = await Collection.new({ user_id: user.id, name: "testCollection" });
    await Collection.addParkToCollection({ parkCode: "test1", collection_id: collection.id });
    let response = await Collection.getByUserID(user.id);
    expect(response).toEqual([{
      "id": expect.any(Number),
      "name": "testCollection",
      "parkCodes": [
        "test1",
      ],
      "parks": [
        {
          "fullName": "testPark1",
          "parkCode": "test1",
        },
      ],
    }])
  });

  test("returns empty if no collections for that user", async function () {
    let user = await User.get("u1");
    let response = await Collection.getByUserID(user.id);
    expect(response).toEqual([])
  });
});