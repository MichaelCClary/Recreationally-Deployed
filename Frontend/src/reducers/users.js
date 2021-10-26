const INITIAL_STATE = { user: null, token: null };


function users(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "CHECK_IN_USER":
            return {
                ...state,
                user: { ...action.user },
                token: action.token
            };

        case "UPDATE_USER":
            return {
                ...state,
                user: { ...action.user }
            };

        case "LOG_OUT":
            return {
                ...INITIAL_STATE
            };

        case 'ERROR':
            return { ...state, error: true };

        default: return state;
    }
}

export default users;