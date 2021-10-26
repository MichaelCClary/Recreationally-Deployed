"use strict";

const db = require("../db.js");
const User = require("../models/user");
const { createToken } = require("../helpers/tokens");


async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM parks");
  await db.query("DELETE FROM topics");
  await db.query("DELETE FROM activities");
  await db.query("DELETE FROM collections");

  await User.register({
    username: "u1",
    email: "user1@user.com",
    password: "password1",
    isAdmin: true,
  });
  await User.register({
    username: "u2",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });

  await db.query(`
  INSERT INTO topics(id,
                    name)
  VALUES ('t1', 'test_topic1'),
          ('t2', 'test_topic2')
  RETURNING id, name`);

  await db.query(`
  INSERT INTO activities(id,
                        name)
  VALUES ('a1', 'test_activity1'),
          ('a2', 'test_activity2')
  RETURNING id, name`);

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
  VALUES ('test2', 'testParkname2', 'Test Park2', 'NY',
           'testDesignation2', '123', '123', 'testDirections2', 
           'testWeather2', 'testCost2', 'testCost_description2'),
         ('test1', 'testPark1', 'Test Park description', 'TX',
           'testDesignation1', '123', '123', 'testDirections1', 
           'testWeather1', 'testCost1', 'testCost_description1')
  RETURNING "parkCode"`);

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


const u1Token = createToken({ username: "u1", isAdmin: true });
const u2Token = createToken({ username: "u2", isAdmin: false });
const u3Token = createToken({ username: "u3", isAdmin: false });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token, u2Token, u3Token
};
