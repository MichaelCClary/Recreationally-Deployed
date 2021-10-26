"use strict";

const request = require("supertest");

const db = require("../db.js");
const app = require("../app");
const User = require("../models/user");
const Collection = require("../models/collection");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token, u2Token, u3Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /users/:username/collection */

describe("POST /users/:username/collection", function () {
    test("works for admin: create collection for user", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                name: "u-new",
                user_id: user2.id,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            collection: {
                name: "u-new",
                user_id: user2.id,
                id: expect.any(Number),
            },
        });
    });

    test("works for correct user: create collection for user", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                name: "u-new",
                user_id: user2.id,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            collection: {
                name: "u-new",
                user_id: user2.id,
                id: expect.any(Number),
            },
        });
    });

    test("unauth for anon", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                name: "u-new",
                user_id: user2.id,
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for wrong user", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                name: "u-new",
                user_id: user2.id,
            }).set("authorization", `Bearer ${u3Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request if missing data", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                user_id: user2.id,
            }).set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request if invalid data", async function () {
        const user2 = await User.get("u2");
        const resp = await request(app)
            .post("/users/u2/collection")
            .send({
                name: 13,
                user_id: user2.id,
            }).set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** POST /users/:username/collection/park */

describe("POST /users/:username/collection/park", function () {
    test("works for admin: add park to collection", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            collection: [{
                parkCode: "test1",
                collection_id: expect.any(Number),
            }],
        });
    });

    test("works for correct user: add park to collection", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({
            collection: [{
                parkCode: "test1",
                collection_id: expect.any(Number),
            }],
        });
    });

    test("unauth for anon", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for wrong user", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request if missing data", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request if invalid data", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .post("/users/u2/collection/park")
            .send({
                parkCode: 13,
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /users/:username/collection */

describe("DELETE /users/:username/collection", function () {
    test("works for admin - deletes collection", async function () {
        const user1 = await User.get("u1");
        const collection = await Collection.new({ user_id: user1.id, name: "testCollection" })
        const resp = await request(app)
            .delete(`/users/u1/collection`)
            .send({ collection_id: collection.id })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: expect.any(Number) });
    });

    test("works for current user - deletes collection", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .delete(`/users/u2/collection`)
            .send({ collection_id: collection.id })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.body).toEqual({ deleted: expect.any(Number) });
    });

    test("unauth for anon", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .delete(`/users/u1/collection`)
            .send({ collection_id: collection.id })
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for other users", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        const resp = await request(app)
            .delete(`/users/u2/collection`)
            .send({ collection_id: collection.id })
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if collection doesn't exist", async function () {
        const resp = await request(app)
            .delete(`/users/u2/collection`)
            .send({ collection_id: 0 })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************** DELETE /users/:username/collection/park */

describe("DELETE /users/:username/collection/park", function () {
    test("works for admin - removes park from collection", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        await Collection.addParkToCollection({
            parkCode: "test1",
            collection_id: collection.id,
        })
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: `park test1 from collection ${collection.id}` });
    });

    test("works for current user - removes park from collection", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        await Collection.addParkToCollection({
            parkCode: "test1",
            collection_id: collection.id,
        })
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.body).toEqual({ deleted: `park test1 from collection ${collection.id}` });
    });

    test("unauth for anon", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        await Collection.addParkToCollection({
            parkCode: "test1",
            collection_id: collection.id,
        })
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for other users", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        await Collection.addParkToCollection({
            parkCode: "test1",
            collection_id: collection.id,
        })
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u3Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found if collection doesn't exist", async function () {
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test1",
                collection_id: 0,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("not found if park isn't currently in collection or doesn't exist", async function () {
        const user2 = await User.get("u2");
        const collection = await Collection.new({ user_id: user2.id, name: "testCollection" })
        await Collection.addParkToCollection({
            parkCode: "test1",
            collection_id: collection.id,
        })
        const resp = await request(app)
            .delete("/users/u2/collection/park")
            .send({
                parkCode: "test2",
                collection_id: collection.id,
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});
