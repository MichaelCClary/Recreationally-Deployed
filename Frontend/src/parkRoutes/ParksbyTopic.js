import React from 'react';
import { useParams } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import ParkCard from './ParkCard';
import { getParksByTopic } from '../actions/parks';
import { useEffect } from 'react';
import { Button, makeStyles, } from '@material-ui/core';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});
function ParksByTopic() {
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();
    const { topicName } = useParams();
    const { topics, parksFromSearch } = useSelector((state => state.parks), shallowEqual);

    useEffect(() => {
        let id;
        for (let top of topics) {
            if (top.name === topicName) {
                id = top.id;
                break;
            }
        }
        dispatch(getParksByTopic(id))
    }, [dispatch, topicName, topics])

    const handleClick = () => {
        history.push('/parks/topics');
    }

    return (
        <>
            <h1>Parks for {topicName}</h1>
            <Button className={classes.buttons} variant="contained" color="secondary" onClick={handleClick}>
                Browse By Topic
            </Button>
            {parksFromSearch && parksFromSearch.map((park) => (
                <ParkCard key={park.parkCode} park={park} />
            ))}
            {parksFromSearch && !parksFromSearch.length && <h3>Sorry that topic doesn't exist</h3>}
        </>

    );
}

export default ParksByTopic;