import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle } from '@material-ui/core';

function DeleteParkFromCollectionDialog({ parkCode, handleClose, open, handleParkDelete, parkName, }) {
    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{`Remove ${parkName} from this collection?`}</DialogTitle>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={() => handleParkDelete(parkCode)} color="primary" autoFocus>
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default DeleteParkFromCollectionDialog;