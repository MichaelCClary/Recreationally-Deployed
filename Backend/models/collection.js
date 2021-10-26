"use strict";

const db = require("../db");
const {
    BadRequestError,
    NotFoundError
} = require("../expressError");

/** Related functions for users. */

class Collection {
    /** Add new Collection
     *
     * Returns collection (id, name, user_id)
     **/

    static async new({ user_id, name }) {
        const result = await db.query(
            `INSERT INTO collections
               (user_id,
                name)
               VALUES ($1, $2)
               RETURNING id, name, user_id`,
            [
                user_id,
                name,
            ],
        );

        const collection = result.rows[0];

        return collection;
    }

    /** Get get collection by user_id.
    *
    * collections with parkCodes and parkNames
    **/

    static async getByUserID(user_id) {
        const collectionRes = await db.query(
            `SELECT id, name
           FROM collections
           WHERE user_id = $1`,
            [user_id],
        );

        let collection = collectionRes.rows;

        for (let col of collection) {
            const parks = await this.getParksInCollection(col.id);
            const parkCodes = [];
            for (let park of parks) {
                parkCodes.push(park.parkCode)
            }
            col.parks = parks;
            col.parkCodes = parkCodes;
        }

        return collection;
    }

    /** Delete given collection from database; returns undefined. */

    static async remove(collection_id) {
        let result = await db.query(
            `DELETE
           FROM collections
           WHERE id = $1
           RETURNING id`,
            [collection_id],
        );
        const collection = result.rows[0];

        if (!collection) throw new NotFoundError(`No collection: ${collection_id}`);
    }


    /** Add park to collection
    *
    * Returns parkCode and collection_id
    **/

    static async addParkToCollection({ parkCode, collection_id }) {
        try {
            const result = await db.query(
                `INSERT INTO collections_parks
                   ("parkCode", collection_id)
                   VALUES ($1, $2)
                   RETURNING "parkCode", collection_id`,
                [
                    parkCode,
                    collection_id
                ],
            );
            return result.rows
        } catch (e) {
            if (e.code == 23505) {
                throw new BadRequestError(`collection: ${collection_id} has parkCode: ${parkCode}`)
            }
            if (e.code == 23503) {
                throw new BadRequestError(`park: ${parkCode} or collection: ${collection_id} does not exist, please double check`)
            }
        }
    }

    /** Get Parks by collection from DB.
      *
      * Returns parkCodes, and park names in collection
      **/

    static async getParksInCollection(collection_id) {
        try {
            const Res = await db.query(
                `SELECT parks."parkCode", parks."fullName"
                FROM collections_parks
                INNER JOIN parks
                ON parks."parkCode" = collections_parks."parkCode"
                WHERE collection_id = $1`,
                [collection_id],
            );
            return Res.rows
        } catch (error) {
            console.error(error);
        }
    }

    /** Delete given park from collection in database; returns undefined. */

    static async removeParkFromCollection(collection_id, parkCode) {
        let result = await db.query(
            `DELETE
               FROM collections_parks
               WHERE collection_id = $1 AND "parkCode" = $2
               RETURNING "parkCode"`,
            [collection_id, parkCode],
        );
        const park = result.rows[0];

        if (!park) throw new NotFoundError(`No park: ${parkCode} in collection: ${collection_id}`);
    }


}


module.exports = Collection;