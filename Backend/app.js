"use strict";

/** Express app for recreationally. */

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const Park = require("./models/park")
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const parksRoutes = require("./routes/parks");

const { authenticateJWT } = require("./middleware/auth");
const morgan = require("morgan");
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/parks", parksRoutes);

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
});

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

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;

    return res.status(status).json({
        error: { message, status },
    });
});

module.exports = app;