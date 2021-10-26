import React from 'react';
import { useParams, useHistory } from "react-router-dom";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import ParkDetail from './ParkDetail';
import { Button, makeStyles, Backdrop, CircularProgress, } from '@material-ui/core';
import { getParkByParkCode } from '../actions/parks';
import { useEffect } from 'react';

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});

function ParkInfoLogic() {
    const dispatch = useDispatch();
    const { parkCode } = useParams();
    const { parkDetail, loading } = useSelector((state => state.parks), shallowEqual);
    const history = useHistory();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getParkByParkCode(parkCode))
    }, [dispatch, parkCode])

    const goBack = () => {
        history.goBack()
    }

    return (
        <>
            {loading && <Backdrop className={classes.backdrop} open>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <Button className={classes.buttons} variant="contained" color="secondary" onClick={goBack}>
                Go Back
            </Button>
            {parkDetail && <ParkDetail park={parkDetail.park} />}

        </>

    );
}

export default ParkInfoLogic;