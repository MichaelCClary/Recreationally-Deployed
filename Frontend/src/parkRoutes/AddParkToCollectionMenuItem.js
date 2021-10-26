import React from 'react';
import { MenuItem, ListItemIcon, } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';

function AddParkToCollectionsMenuItem({ park, collection, handleAdd }) {
    let inCollection = false;

    if (collection.parkCodes.indexOf(park) >= 0) {
        inCollection = true;
    }

    return (
        <>
            {!inCollection && <MenuItem onClick={() => handleAdd(collection.id)} key={collection.id}>
                {collection.name}
            </MenuItem>}
            {inCollection && <MenuItem onClick={() => handleAdd(collection.id)} key={collection.id}>
                {collection.name}
                <ListItemIcon>
                    <CheckIcon />
                </ListItemIcon>
            </MenuItem>}
        </>
    );
}

export default AddParkToCollectionsMenuItem;