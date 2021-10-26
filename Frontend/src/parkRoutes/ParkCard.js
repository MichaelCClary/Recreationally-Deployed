import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card, CardContent, CardActions,
    Collapse, IconButton, CardMedia, Button,
    Typography,
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ParkChip from './ParkChip';
import AddParkToCollectionsMenu from './AddParkToCollectionsMenu';
import { shallowEqual, useSelector, } from "react-redux";

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    expand: {
        transform: 'rotate(0deg)',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    title: {
        fontSize: "2.5rem",
    },
    detailButton: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    LinkButton: {
        marginTop: 10
    }
}));


function ParkCard({ park }) {
    const classes = useStyles();
    const [expanded, setExpanded] = React.useState(false);
    const { user } = useSelector((state => state.users), shallowEqual);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <>
            <Card className={classes.root}>
                <Typography variant="h4">
                    {park.fullName}
                </Typography>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {park.description}
                    </Typography>
                    <Button color="primary" key={park.parkCode} variant="outlined" href={`/parks/${park.parkCode}`} className={classes.LinkButton}>
                        Park Detail Page
                    </Button>
                    {user && <AddParkToCollectionsMenu park={park.parkCode} />}
                    <CardMedia
                        component="img"
                        height="194"
                        image={park.images[0].url}
                        alt={park.images[0].altText}
                    />
                </CardContent>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        {park.activities && <Typography variant="h4">Activities:</Typography>}
                        {park.activities && park.activities.map((activity) => (
                            <ParkChip key={activity.name} label={activity.name} type="activities" />
                        ))}
                        <Typography variant="h4">Topics:</Typography>
                        {park.topics && park.topics.map((topic) => (
                            <ParkChip key={topic.name} label={topic.name} type="topics" />
                        ))}
                    </CardContent>
                </Collapse>
                <CardActions className={classes.detailButton}>
                    <IconButton
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        Details
                        <ExpandMoreIcon
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })} />
                    </IconButton>
                </CardActions>
            </Card >

        </>
    );
}

export default ParkCard;