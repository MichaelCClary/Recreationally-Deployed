"use strict";

/** Routes for parks. */

const jsonschema = require("jsonschema");

const express = require("express");
const { BadRequestError } = require("../expressError");
const Park = require("../models/park");
const Activity = require("../models/activity");
const Topic = require("../models/topic");

const router = express.Router();


/** GET / => { parks: [ {id, name, description }, ... ] }
 *
 * Returns list of all parks.
 *
 * Authorization required: none
 **/

router.get("/", async function (req, res, next) {
    try {
        const parks = await Park.findAllDB();
        return res.json({ parks });
    } catch (err) {
        return next(err);
    }
});


/** GET /random => {gets a random park}
 *
 * selects random park from db
 *
 * Authorization required: none
 **/

router.get("/random", async function (req, res, next) {
    try {
        const parkCode = await Park.getRandom();
        const parks = await Park.getByParkCode(parkCode[0].parkCode)
        return res.json({ parks });
    } catch (err) {
        return next(err);
    }
});

/** GET /activities => { activities : [ {id, name }, ... ] }
 *
 * Get all activities from database
 *
 * Authorization required: none
 **/

router.get("/activities", async function (req, res, next) {
    try {
        const activities = await Activity.getActivitiesFromDB();
        return res.json({ activities });
    } catch (err) {
        return next(err);
    }
});

/** GET /activities/:id => { parks : [ {id, name }, ... ] }
 *
 * Get all parks that have activity
 *
 * Authorization required: none
 **/

router.get("/activities/:id", async function (req, res, next) {
    try {
        const parkCodes = await Park.getParkByActivity(req.params.id);
        const parkPromises = [];
        for (let code of parkCodes) {
            const parkRes = Park.getByParkCode(code.parkCode);
            parkPromises.push(parkRes)
        }
        Promise.all(parkPromises).then((parks) => {
            return res.json({ parks });
        })

    } catch (err) {
        return next(err);
    }
});

/** GET /api/topics => { topics : [ {id, name }, ... ] }
 *
 * Get all topics from database
 *
 * Authorization required: none
 **/

router.get("/topics", async function (req, res, next) {
    try {
        const topics = await Topic.getTopicsFromDB();
        return res.json({ topics });
    } catch (err) {
        return next(err);
    }
});

/** GET /topics/:id => { parks : [ {id, name }, ... ] }
 *
 * Get all parks that have topic
 *
 * Authorization required: none
 **/

router.get("/topics/:id", async function (req, res, next) {
    try {
        const parkCodes = await Park.getParkByTopic(req.params.id);
        const parkPromises = [];
        for (let code of parkCodes) {
            const parkRes = Park.getByParkCode(code.parkCode);
            parkPromises.push(parkRes)
        }
        Promise.all(parkPromises).then((parks) => {
            return res.json({ parks });
        })
    } catch (err) {
        return next(err);
    }
});


/** GET /search => { parks: [ {id, name, description }, ... ] }
 *
 * Search parks in database
 *
 * Authorization required: none
 **/

router.get("/search", async function (req, res, next) {
    try {
        const actID = req.query.activityID;
        const topID = req.query.topicID;

        let filteredParks = []

        if (actID || topID) {
            const parkCodes = await Park.searchDB(req.query);
            const parkPromises = [];

            for (let code of parkCodes) {
                const parkRes = Park.getByParkCode(code.parkCode);
                parkPromises.push(parkRes)
            }
            Promise.all(parkPromises).then((parks) => {
                for (let p of parks) {
                    let includeActivity = false;
                    let includeTopic = false;

                    if (actID) {
                        for (let act of p.activities) {
                            if (act.id === actID) {
                                includeActivity = true;
                            }
                        }
                    } else {
                        includeActivity = true;
                    }

                    if (topID) {
                        for (let top of p.topics) {
                            if (top.id === topID) {
                                includeTopic = true;
                            }
                        }
                    } else {
                        includeTopic = true;
                    }

                    if (includeActivity && includeTopic) {
                        filteredParks.push(p)
                    }
                }
                return res.json({ parks: filteredParks });
            })
        } else {
            const parkCodes = await Park.searchDB(req.query);
            const parkPromises = [];

            for (let code of parkCodes) {
                const parkRes = Park.getByParkCode(code.parkCode);
                parkPromises.push(parkRes)
            }
            Promise.all(parkPromises).then((parks) => {
                return res.json({ parks });
            })
        }

    } catch (err) {
        return next(err);
    }
});


/** GET /[parkCode] => { park }
 *
 * Returns { park}
 *
 * Authorization required: none
 **/

router.get("/:parkCode", async function (req, res, next) {
    try {
        const park = await Park.getByParkCode(req.params.parkCode);
        return res.json({ park });
    } catch (err) {
        return next(err);
    }
});
module.exports = router;
