import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    Card, CardContent,
    Typography, ImageList, ImageListItem, ImageListItemBar
} from '@material-ui/core';
import ParkChip from './ParkChip';
import AddParkToCollectionsMenu from './AddParkToCollectionsMenu';
import { shallowEqual, useSelector, } from "react-redux";

const useStyles = makeStyles(() => ({
    imageList: {
        flexWrap: 'nowrap',
        // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
        transform: 'translateZ(0)',
    },
}));



function ParkDetail({ park }) {
    const classes = useStyles();
    const { user } = useSelector((state => state.users), shallowEqual);

    return (
        <>
            <Card>
                <Typography variant="h3" >{park.fullName}</Typography>
                <ImageList className={classes.imageList} cols={2.5}>
                    {park.images && park.images.map((item) => (
                        <ImageListItem key={item.title}>
                            <img src={item.url} alt={item.altText} />
                            <ImageListItemBar
                                title={item.title}
                                classes={{
                                    root: classes.titleBar,
                                    title: classes.title,
                                }}
                            />
                        </ImageListItem>
                    ))}
                </ImageList>
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {park.description}
                    </Typography>
                </CardContent>
                {user && <AddParkToCollectionsMenu park={park.parkCode} />}
                <CardContent>
                    <Typography variant="h4">Directions:</Typography>
                    <Typography paragraph>
                        {park.directionsInfo}
                    </Typography>
                    {park.cost && <Typography variant="h4">Cost: ${park.cost}</Typography>}
                    {park.cost_description && <Typography paragraph>
                        {park.cost_description}
                    </Typography>}
                    <Typography variant="h4">Weather:</Typography>
                    <Typography paragraph>
                        {park.weatherInfo}
                    </Typography>
                    {park.activities && <Typography variant="h4">Activities:</Typography>}
                    {park.activities && park.activities.map((activity) => (
                        <ParkChip key={activity.name} label={activity.name} type="activities" />
                    ))}
                    <Typography variant="h4">Topics:</Typography>
                    {park.topics && park.topics.map((topic) => (
                        <ParkChip key={topic.name} label={topic.name} type="topics" />
                    ))}
                </CardContent>
            </Card>
        </>
    );
}

export default ParkDetail;