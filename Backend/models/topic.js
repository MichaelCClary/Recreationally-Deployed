"use strict";

const db = require("../db");

const {
    BadRequestError,
} = require("../expressError");

/** Related functions for parks. */

class Topic {
    /** Add topic to DB.
     *
     * Returns topic (id, name)
     **/

    static async addTopictoDB(id, name) {
        const duplicateCheck = await db.query(
            `SELECT id
               FROM topics
               WHERE id = $1`,
            [id],
        );

        if (duplicateCheck.rows[0]) {
            return duplicateCheck.rows[0]
        }

        const result = await db.query(
            `INSERT INTO topics
               (id,
                name)
               VALUES ($1, $2)
               RETURNING id, name`,
            [
                id,
                name,
            ],
        );

        const topic = result.rows[0];

        return topic;
    }

    /** Get Topics from DB.
   *
   * Returns list of topics from database
   **/

    static async getTopicsFromDB() {
        try {
            const topicsRes = await db.query(
                `SELECT * 
                FROM topics
                ORDER BY name`,
            );
            return topicsRes.rows
        } catch (error) {
            console.error(error);
        }
    }

    /** Add topic to park.
     *
     * Returns topic_id, parkCode
     **/

    static async addTopicToPark(parkCode, topic_id) {
        try {
            const result = await db.query(
                `INSERT INTO parks_topics
               ("parkCode", topic_id)
               VALUES ($1, $2)
               RETURNING "parkCode", topic_id`,
                [
                    parkCode,
                    topic_id
                ],
            );
            return result.rows
        } catch (e) {
            if (e.code == 23505) {
                throw new BadRequestError(`park: ${parkCode} has: ${topic_id}`)
            }
            if (e.code == 23503) {
                throw new BadRequestError(`park: ${parkCode} or topic: ${topic_id} does not exist, please double check`)
            }
        }
    }
}


module.exports = Topic;