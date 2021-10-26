import {
    GET_RANDOM_PARK, SEARCH_PARKS, ADD_PARK_DETAIL,
    SETUP_PARKS, LOG_OUT_PARK, ERROR,
    HIDE_LOADER, SHOW_LOADER,
} from "./types"
import RecreationallyApi from "../api";

export function setUpParksForApp() {
    return async function (dispatch) {
        try {
            const activities = await RecreationallyApi.getActivitiesFromDB();
            const topics = await RecreationallyApi.getTopicsFromDB();
            dispatch(setUpParks(activities.activities, topics.topics))
        } catch (e) {
            console.log(e)
            dispatch(gotError())
        }
    }
}

export function getRandomPark() {
    return async function (dispatch) {
        try {
            dispatch(show_loader())
            const park = await RecreationallyApi.getRandomPark();
            dispatch(add_random_park(park.parks))
            dispatch(hide_loader())
        } catch (e) {
            console.log(e)
            dispatch(gotError())
            dispatch(hide_loader())
        }
    }
}

export function getParkByParkCode(parkCode) {
    return async function (dispatch) {
        try {
            dispatch(show_loader())
            const park = await RecreationallyApi.getParkByParkCode(parkCode);
            dispatch(add_park_detail(park))
            dispatch(hide_loader())
        } catch (e) {
            console.log(e)
            dispatch(gotError())
            dispatch(hide_loader())
        }
    }
}

export function searchParks(data) {
    return async function (dispatch) {
        try {
            dispatch(show_loader())
            if (!data.query && !data.states && !data.activityID && !data.topicID) {
                data.limit = 15
            } else {
                data.limit = 500
            }
            const parks = await RecreationallyApi.searchParksDB(data);
            dispatch(add_search_parks(parks.parks))
            dispatch(hide_loader())
        } catch (e) {
            dispatch(hide_loader())
            console.log(e)
            dispatch(gotError())
        }
    }
}

export function getParksByActivity(id) {
    return async function (dispatch) {
        try {
            const parks = await RecreationallyApi.getParksByActivity(id);
            dispatch(add_search_parks(parks.parks))
        } catch (e) {
            console.log(e)
            dispatch(gotError())
        }
    }
}

export function getParksByTopic(id) {
    return async function (dispatch) {
        try {
            const parks = await RecreationallyApi.getParksByTopic(id);
            dispatch(add_search_parks(parks.parks))
        } catch (e) {
            console.log(e)
            dispatch(gotError())
        }
    }
}

export function logOutPark() {
    return function (dispatch) {
        dispatch(log_out_park())
    }
}

export const add_random_park = (park) => ({
    type: GET_RANDOM_PARK,
    park
})

export const add_park_detail = (park) => ({
    type: ADD_PARK_DETAIL,
    park
})

export const add_search_parks = (parks) => ({
    type: SEARCH_PARKS,
    parks
})

export const setUpParks = (activities, topics) => ({
    type: SETUP_PARKS,
    activities,
    topics
})

export const log_out_park = () => ({
    type: LOG_OUT_PARK
})

export const gotError = () => ({
    type: ERROR,
})

export const hide_loader = () => ({
    type: HIDE_LOADER
})

export const show_loader = () => ({
    type: SHOW_LOADER
})