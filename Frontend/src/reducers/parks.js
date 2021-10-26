const INITIAL_STATE = {
    randomPark: null,
    parkDetail: null,
    parksFromSearch: null,
    topics: [],
    activities: [],
    loading: false
};


function users(state = INITIAL_STATE, action) {
    switch (action.type) {
        case "GET_RANDOM_PARK":
            return {
                ...state,
                randomPark: { ...action.park }
            };

        case "ADD_PARK_DETAIL":
            return {
                ...state,
                parkDetail: { ...action.park }
            };

        case "SEARCH_PARKS":
            return {
                ...state,
                parksFromSearch: [...action.parks]
            };

        case "SETUP_PARKS":
            return {
                ...state,
                topics: [...action.topics],
                activities: [...action.activities]
            };

        case "LOG_OUT_PARK":
            return {
                ...state,
                randomPark: null,
                parkDetail: null,
                parksFromSearch: null
            };

        case "HIDE_LOADER":
            return {
                ...state,
                loading: false,
            };

        case "SHOW_LOADER":
            return {
                ...state,
                loading: true,
            };

        default:
            return state;
    }
}

export default users;