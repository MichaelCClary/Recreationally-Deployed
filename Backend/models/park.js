"use strict";

const db = require("../db");

const {
    NotFoundError,
} = require("../expressError");
const axios = require('axios');
const Activity = require('./activity');
const Topic = require('./topic');
const BASE_URL = "https://developer.nps.gov/api/v1";
const { API_KEY } = require("../config");

/** Related functions for parks. */

class Park {

    static async addPark(park) {
        const duplicateCheck = await db.query(
            `SELECT "parkCode"
               FROM parks
               WHERE "parkCode" = $1`,
            [park.parkCode],
        );

        if (duplicateCheck.rows[0]) {
            return duplicateCheck.rows[0]
        }

        if (park.entranceFees.length === 0) {
            const defaultCost =
            {
                "cost": "N/A",
                "description": "Our records don't show this accurately, please check with park for more information",
                "title": "Our records don't show this accurately, please check with park for more information"
            }
            park.entranceFees.push(defaultCost)
        }

        const result = await db.query(
            `INSERT INTO parks
               ("parkCode",
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
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
               RETURNING "parkCode"`,
            [
                park.parkCode,
                park.fullName,
                park.description,
                park.states,
                park.designation,
                park.latitude,
                park.longitude,
                park.directionsInfo,
                park.weatherInfo,
                park.entranceFees[0].cost,
                park.entranceFees[0].description
            ],
        );

        const parkRes = result.rows[0];

        for (let act of park.activities) {
            const res = await Activity.addActivitytoDB(act.id, act.name)
            if (res.name === act.name) {
                const result = await db.query(
                    `SELECT activity_id
                       FROM parks_activities
                       WHERE "parkCode" = $1`,
                    [park.parkCode],
                );
                let notInDB = true;
                for (let activity of result.rows) {
                    if (activity.activity_id === res.id) {
                        notInDB = false;
                    }
                }

                if (notInDB) {
                    Activity.addActivityToPark(park.parkCode, res.id)
                }
            } else {
                Activity.addActivityToPark(park.parkCode, act.id)
            }

        }
        for (let top of park.topics) {
            await Topic.addTopictoDB(top.id, top.name)
            Topic.addTopicToPark(park.parkCode, top.id)
        }
        for (let im of park.images) {
            const image = { ...im };
            image.parkCode = park.parkCode;
            this.addImagetoDB(image);
        }

        return parkRes;
    }

    /** Find all parks.
     *
     * Returns [{ parkCodes: }, ...]
     **/

    static async findAllDB() {
        const result = await db.query(
            `SELECT "parkCode"
           FROM parks
           ORDER BY "fullName"`,
        );

        return result.rows;
    }

    /** Search db park by query in name, description
     *
     * Returns [{ parkCodes: }, ...]
     **/

    static async searchDB(data) {
        const query = `%${data.query}%`;
        const states = `%${data.states}%`;

        const result = await db.query(
            `SELECT "parkCode"
               FROM parks
               WHERE ("fullName" ILIKE $1 OR description ILIKE $1)
               AND states ILIKE $2
               LIMIT $3`,
            [query, states, data.limit],
        );

        return result.rows;
    }

    static async request(endpoint, data = {}, method = "get",) {
        console.debug("API Call:", endpoint, data, method);

        const url = `${BASE_URL}/${endpoint}&api_key=${API_KEY}`;
        const params = (method === "get")
            ? data
            : {};

        try {
            return (await axios({ url, method, data, params })).data;
        } catch (err) {
            console.error("API Error:", err.response);
        }
    }

    /** Gets all parks from API.
     *
     * Returns parks from national park service api
     **/

    static async getParksFromAPI() {
        try {
            let res = await this.request(`parks?limit=1000`);
            return res;
        } catch (error) {
            console.error(error);
        }
    }

    /** gets random park.
     *
     * Returns 1 random park from DB
     **/

    static async getRandom() {
        try {
            const num = await this.findAllDB();
            const randomNum = Math.floor(Math.random() * num.length);
            const result = await db.query(
                `SELECT "parkCode"
                   FROM parks
                   LIMIT 1 OFFSET $1`,
                [randomNum],
            );

            return result.rows;
        } catch (error) {
            console.error(error);
        }
    }

    /** Given a parkCode, return data about park.
     *
     * Returns { parkCode, fullName, description}
     *
     * Throws NotFoundError if park not found.
     **/

    static async getByParkCode(parkCode) {
        const parkRes = await db.query(
            `SELECT *
           FROM parks
           WHERE "parkCode" = $1`,
            [parkCode],
        );

        let park = parkRes.rows[0];

        if (!park) throw new NotFoundError(`No park: ${parkCode}`);

        const activitiesRes = await db.query(
            `SELECT activities.name, activities.id
                 FROM parks_activities
                 INNER JOIN activities 
                 ON parks_activities.activity_id = activities.id
                 WHERE "parkCode" = $1`,
            [parkCode],
        );

        const topicsRes = await db.query(
            `SELECT topics.name, topics.id
                 FROM parks_topics
                 INNER JOIN topics 
                 ON parks_topics.topic_id = topics.id
                 WHERE "parkCode" = $1`,
            [parkCode],
        );

        const imagesRes = await db.query(
            `SELECT *
                 FROM images
                 WHERE "parkCode" = $1`,
            [parkCode],
        );

        park.activities = activitiesRes.rows;
        park.topics = topicsRes.rows;
        park.images = imagesRes.rows;

        return park;
    }

    /** Get Parks by Activity from DB.
      *
      * Returns parkCodes that have that activity
      **/

    static async getParkByActivity(activity_id) {
        try {
            const activitiesRes = await db.query(
                `SELECT "parkCode"
                             FROM parks_activities
                             WHERE activity_id = $1`,
                [activity_id],
            );
            return activitiesRes.rows
        } catch (error) {
            console.error(error);
        }
    }

    /** Get Park by topic from DB.
  *
  * Returns parkCodes that have that topics
  **/

    static async getParkByTopic(topic_id) {
        try {
            const topicsRes = await db.query(
                `SELECT "parkCode"
                                 FROM parks_topics
                                 WHERE topic_id = $1`,
                [topic_id],
            );
            return topicsRes.rows
        } catch (error) {
            console.error(error);
        }
    }

    /** Add image to DB.
     *
     * Returns activity (id, credit, title, altText, caption, url, parkCode, comment, user_id)
     **/

    static async addImagetoDB({ credit, title, altText, caption, url, parkCode, comment, user_id }) {
        const result = await db.query(
            `INSERT INTO images
                   (credit,
                    title,
                    altText,
                    caption,
                    url,
                    "parkCode",
                    comment,
                    user_id)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                   RETURNING id, credit, title, altText, caption, url, "parkCode", comment, user_id`,
            [
                credit,
                title,
                altText,
                caption,
                url,
                parkCode,
                comment,
                user_id
            ],
        );

        const activity = result.rows[0];

        return activity;
    }
}

async function updateDBParks() {
    try {
        let parks = await Park.getParksFromAPI();
        for (let park of parks.data) {
            await Park.addPark(park);
        }
    } catch (err) {
        console.error("API Error:", err);
    }

}

updateDBParks();


module.exports = Park;
