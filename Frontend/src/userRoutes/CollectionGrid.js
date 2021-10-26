import React from 'react';
import {
    List, ListItem, ListItemText, ListItemSecondaryAction,
    makeStyles, Typography,
    IconButton, Tooltip
} from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCollection, removeParkFromCollection } from '../actions/users';
import DeleteParkFromCollectionDialog from './DeleteParkFromCollectionDialog';
import DeleteCollectionDialog from './DeleteCollectionDialog';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        textAlign: "center",
        fontSize: 30
    },
    demo: {
        backgroundColor: theme.palette.background.paper,
    },
    title: {
        margin: theme.spacing(4, 0, 2),
        display: "block"
    },
    listItemText: {
        fontSize: '1em',
    }
}));


function CollectionGrid({ collection, username }) {
    const classes = useStyles();
    const history = useHistory();
    const dispatch = useDispatch();

    const handleCollectionDelete = () => {
        dispatch(deleteCollection(username, { collection_id: collection.id }));
    }

    const handleParkDelete = (parkCode) => {
        dispatch(removeParkFromCollection(username, { collection_id: collection.id, parkCode: parkCode }));
        setParkOpen(false);
    }

    const handleLink = (parkCode) => {
        history.push(`/parks/${parkCode}`);
    }

    const [parkOpen, setParkOpen] = React.useState(false);
    const [CollectionOpen, setCollectionOpen] = React.useState(false);

    const handleParkClickOpen = () => {
        setParkOpen(true);
    };

    const handleCollectionClickOpen = () => {
        setCollectionOpen(true);
    };

    const handleClose = () => {
        setParkOpen(false);
        setCollectionOpen(false)
    };

    return (
        <div className={classes.root}>
            {collection && <Typography variant="h4" className={classes.title}>
                {collection.name}
                <Tooltip title="Delete Collection" aria-label="delete-collection">
                    <IconButton edge="end" aria-label="delete-collection" key={collection.id + "delete"} onClick={handleCollectionClickOpen}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </Typography>}
            <DeleteCollectionDialog
                handleClose={handleClose}
                open={CollectionOpen}
                handleCollectionDelete={handleCollectionDelete}
                collectionName={collection.name}
            />
            <div>
                <List>
                    {collection.parks && collection.parks.map((park) => (
                        < ListItem key={collection.id + park.fullName} >
                            <ListItemText classes={{ primary: classes.listItemText }}
                                primary={park.fullName}
                            />
                            <ListItemSecondaryAction>
                                <Tooltip title="Park Details" aria-label="Park Details">
                                    <IconButton edge="start" aria-label="more info" onClick={() => handleLink(park.parkCode)}>
                                        <DescriptionIcon />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete Park" aria-label="delete-park">
                                    <IconButton edge="end" aria-label="delete-park" onClick={handleParkClickOpen}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Tooltip>
                                <DeleteParkFromCollectionDialog
                                    handleClose={handleClose}
                                    open={parkOpen}
                                    handleParkDelete={handleParkDelete}
                                    parkCode={park.parkCode}
                                    parkName={park.fullName}
                                />
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </div>
        </div >
    );
}

export default CollectionGrid;
