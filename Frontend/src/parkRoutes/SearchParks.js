import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { searchParks } from '../actions/parks';
import ParkCard from "./ParkCard"
import {
    Button, NativeSelect, InputLabel,
    FormControl, FormHelperText, TextField,
    InputAdornment, Backdrop, CircularProgress,
    Card, CardContent, Typography
} from '@material-ui/core';
import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { states } from '../utils'

const useStyles = makeStyles((theme) => ({
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
        maxWidth: 300,
    },
    searchButton: {
        marginTop: 10,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

function SearchParks() {
    const classes = useStyles();
    const [state, setState] = React.useState({
        state: '',
        query: '',
        activity: '',
        topic: ''
    });

    const handleChange = (event) => {
        const name = event.target.name;
        setState({
            ...state,
            [name]: event.target.value,
        });
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(searchParks({ states: state.state, query: state.query, activityID: state.activity, topicID: state.topic }))
    }, [dispatch])

    const { parksFromSearch, activities, topics, loading } = useSelector((state => state.parks), shallowEqual);

    const handleSearch = () => {
        dispatch(searchParks({ states: state.state, query: state.query, activityID: state.activity, topicID: state.topic }))
    }

    function keyPress(e) {
        if (e.keyCode === 13) {
            dispatch(searchParks({ states: state.state, query: state.query, activityID: state.activity, topicID: state.topic }))
        }
    }

    let noResults = false;

    if (parksFromSearch && parksFromSearch.length === 0) noResults = true;

    return (
        <>
            {loading && <Backdrop className={classes.backdrop} open>
                <CircularProgress color="inherit" />
            </Backdrop>}
            <Typography variant="h4">
                Search Parks
            </Typography>
            <Card className={classes.root}>
                <CardContent>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="state-selector">State</InputLabel>
                        <NativeSelect
                            value={state.state}
                            onChange={handleChange}
                            inputProps={{
                                name: 'state',
                                id: 'state-selector',
                            }}
                        >
                            <option aria-label="None" value="" />
                            {states.map((state) => (
                                <option key={state.code} value={state.code}>
                                    {state.name}
                                </option>
                            ))}
                        </NativeSelect>
                        <FormHelperText>Select a state</FormHelperText>
                    </FormControl>
                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="activity-selector">Activity</InputLabel>
                        <NativeSelect
                            value={state.activity}
                            onChange={handleChange}
                            inputProps={{
                                name: 'activity',
                                id: 'activity-selector',
                            }}
                        >
                            <option aria-label="None" value='' />
                            {activities.map((act) => (
                                <option key={act.id} value={act.id}>
                                    {act.name}
                                </option>
                            ))}
                        </NativeSelect>
                        <FormHelperText>Select an activity</FormHelperText>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="topic-selector">Topic</InputLabel>
                        <NativeSelect
                            value={state.topic}
                            onChange={handleChange}
                            inputProps={{
                                name: 'topic',
                                id: 'topic-selector',
                            }}
                        >
                            <option aria-label="None" value='' />
                            {topics.map((top) => (
                                <option key={top.id} value={top.id}>
                                    {top.name}
                                </option>
                            ))}
                        </NativeSelect>
                        <FormHelperText>Select a topic</FormHelperText>

                    </FormControl>
                    <TextField
                        fullWidth
                        name='query'
                        onKeyDown={keyPress}
                        onChange={handleChange}
                        label="Search"
                        id="query"
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>,
                        }}
                    />
                    <Button variant="contained" color="secondary" onClick={handleSearch} className={classes.searchButton}>
                        Search
                    </Button>
                </CardContent>
            </Card>
            {
                parksFromSearch && parksFromSearch.map((park) => (
                    <ParkCard key={park.parkCode} park={park} />
                ))
            }

            {noResults && <h4>Sorry, no results from that search</h4>}
        </>
    )
}

export default SearchParks;
