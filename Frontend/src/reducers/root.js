import { combineReducers } from "redux";
import users from "./users";
import parks from "./parks";

const appReducer = combineReducers({
    users,
    parks
});

const root = (state, action) => {
    // when a logout action is dispatched it will reset redux state
    if (action.type === 'USER_LOGGED_OUT') {
        state = undefined;
    }

    return appReducer(state, action);
};

export default root;