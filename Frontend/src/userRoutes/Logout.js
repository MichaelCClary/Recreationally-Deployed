import { useDispatch } from "react-redux";
import { logOutUser } from '../actions/users';
import { logOutPark } from '../actions/parks'
import { Redirect } from "react-router-dom";

function Logout() {

    const dispatch = useDispatch();
    dispatch(logOutUser())
    dispatch(logOutPark())

    return (
        <Redirect to="/" />
    );
}

export default Logout;
