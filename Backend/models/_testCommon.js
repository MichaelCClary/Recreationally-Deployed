const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  // noinspection SqlWithoutWhere
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM parks");
  await db.query("DELETE FROM topics");
  await db.query("DELETE FROM activities");
  await db.query("DELETE FROM collections");

  await db.query(`
        INSERT INTO users(username,
                          password,
                          email)
        VALUES ('u1', $1, 'u1@email.com'),
               ('u2', $2, 'u2@email.com')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]);

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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};