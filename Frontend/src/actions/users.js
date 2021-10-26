import {
    CHECK_IN_USER, LOG_OUT, ERROR, UPDATE_USER
} from "./types"

import RecreationallyApi from "../api";

const jwt = require("jsonwebtoken");


export function logInUser(data) {
    return async function (dispatch) {
        function onSuccess(success, token) {
            dispatch(check_in_user(success, token));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            const token = await RecreationallyApi.login(data)
            RecreationallyApi.token = token;
            const decodedUser = jwt.decode(token);
            const success = await RecreationallyApi.getUser(decodedUser.username);
            return onSuccess(success, token);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function signUpUser(data) {
    return async function (dispatch) {
        function onSuccess(success, token) {
            dispatch(check_in_user(success, token));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            const token = await RecreationallyApi.signup(data)
            RecreationallyApi.token = token;
            const decodedUser = jwt.decode(token);
            const success = await RecreationallyApi.getUser(decodedUser.username);
            return onSuccess(success, token);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function editUser(username, data) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            const success = await RecreationallyApi.editUser(username, data);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function logOutUser() {
    return function (dispatch) {
        RecreationallyApi.token = '';
        dispatch(log_out_user())
    }
}

export function addCollection(username, data) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            await RecreationallyApi.addCollection(username, data);
            const success = await RecreationallyApi.getUser(username);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function deleteCollection(username, data) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            await RecreationallyApi.deleteCollection(username, data);
            const success = await RecreationallyApi.getUser(username);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function removeParkFromCollection(username, data) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            await RecreationallyApi.removeParkFromCollection(username, data);
            const success = await RecreationallyApi.getUser(username);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export function addParkToCollection(username, data) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            await RecreationallyApi.addParkToCollection(username, data);
            const success = await RecreationallyApi.getUser(username);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}


export function newCollectionAndAddPark(username, data, park) {
    return async function (dispatch) {
        function onSuccess(success) {
            dispatch(update_user(success));
            return success;
        }
        function onError(error) {
            dispatch(gotError())
            return error;
        }
        try {
            const res = await RecreationallyApi.addCollection(username, data);
            await RecreationallyApi.addParkToCollection(username, { parkCode: park, collection_id: res.collection.id })
            const success = await RecreationallyApi.getUser(username);
            return onSuccess(success);
        } catch (e) {
            console.log(e)
            return onError(e)
        }
    }
}

export const check_in_user = (user, token) => ({
    type: CHECK_IN_USER,
    user,
    token
})

export const update_user = (user) => ({
    type: UPDATE_USER,
    user,
})

export const log_out_user = () => ({
    type: LOG_OUT
})

export const gotError = () => ({
    type: ERROR,
})