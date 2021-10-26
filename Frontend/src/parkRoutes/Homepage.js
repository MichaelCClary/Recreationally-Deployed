import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { getRandomPark } from '../actions/parks';
import ParkDetail from "./ParkDetail"
import { Button, makeStyles, Backdrop, CircularProgress, } from '@material-ui/core';

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});

function Homepage() {
    const dispatch = useDispatch();
    const classes = useStyles();

    useEffect(() => {
        dispatch(getRandomPark())
    }, [dispatch])

    const { randomPark, loading } = useSelector((state => state.parks), shallowEqual);
    const handleRandom = () => {
        dispatch(getRandomPark())
    }

    return (
        <>
            {loading && <Backdrop className={classes.backdrop} open>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <Button className={classes.buttons} variant="contained" color="secondary" onClick={handleRandom}>
                Random Park
            </Button>
            {randomPark && <ParkDetail park={randomPark} />}
        </>
    )
}

export default Homepage;