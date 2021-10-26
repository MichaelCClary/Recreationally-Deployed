"use strict";

const db = require("../db");

const {
    BadRequestError,
} = require("../expressError");

/** Related functions for activities. */

class Activity {

    /** Add activity to DB.
     *
     * Returns activity (id, name)
     **/

    static async addActivitytoDB(id, name) {
        const duplicateCheck = await db.query(
            `SELECT id, name
               FROM activities
               WHERE id = $1 OR
               name = $2`,
            [id, name],
        );

        if (duplicateCheck.rows[0]) {
            return duplicateCheck.rows[0]
        }

        const result = await db.query(
            `INSERT INTO activities
               (id,
                name)
               VALUES ($1, $2)
               RETURNING id, name`,
            [
                id,
                name,
            ],
        );

        const activity = result.rows[0];

        return activity;
    }

    /** Get Activities from DB.
  *
  * Returns list of activities from database
  **/

    static async getActivitiesFromDB() {
        try {
            const activitiesRes = await db.query(
                `SELECT * 
                FROM activities
                ORDER BY name`,
            );
            return activitiesRes.rows
        } catch (error) {
            console.error(error);
        }
    }


    /** Add activity to park.
     *
     * Returns activity_id and parkCode
     **/

    static async addActivityToPark(parkCode, activity_id) {
        try {
            const result = await db.query(
                `INSERT INTO parks_activities
               ("parkCode", activity_id)
               VALUES ($1, $2)
               RETURNING "parkCode", activity_id`,
                [
                    parkCode,
                    activity_id
                ],
            );
            return result.rows
        } catch (e) {
            if (e.code == 23505) {
                throw new BadRequestError(`park: ${parkCode} has: ${activity_id}`)
            }
            if (e.code == 23503) {
                throw new BadRequestError(`park: ${parkCode} or activity: ${activity_id} does not exist, please double check`)
            }
        }
    }
}


module.exports = Activity;