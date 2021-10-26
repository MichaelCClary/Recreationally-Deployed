import React from 'react';
import { useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import ParkCard from './ParkCard';
import { getParksByActivity } from '../actions/parks';
import { useEffect } from 'react';
import { Button, makeStyles, } from '@material-ui/core';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});

function ParksByActivity() {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const { activityName } = useParams();
    const { activities, parksFromSearch } = useSelector((state => state.parks), shallowEqual);

    useEffect(() => {
        let id;
        for (let act of activities) {
            if (act.name === activityName) {
                id = act.id
                break;
            }
        }
        dispatch(getParksByActivity(id))
    }, [dispatch, activityName, activities])

    const handleClick = () => {
        history.push('/parks/activities');
    }

    return (
        <>
            <h1>Parks with {activityName}</h1>
            <Button className={classes.buttons} variant="contained" color="secondary" onClick={handleClick}>
                Browse By Activity
            </Button>
            {parksFromSearch && parksFromSearch.map((park) => (
                <ParkCard key={park.parkCode} park={park} />
            ))}
            {parksFromSearch && !parksFromSearch.length && <h3>Sorry that activity doesn't exist</h3>}
        </>

    );
}

export default ParksByActivity;