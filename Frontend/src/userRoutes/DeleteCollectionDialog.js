import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

function DeleteCollectionDialog({ parkCode, handleClose, open, collectionName, handleCollectionDelete }) {

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {handleCollectionDelete && <DialogTitle id="alert-dialog-title">{`Remove ${collectionName} from your collections?`}</DialogTitle>}
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleCollectionDelete(parkCode)} color="primary" autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteCollectionDialog;