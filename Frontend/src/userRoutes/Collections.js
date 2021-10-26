import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import CollectionGrid from "./CollectionGrid";
import {
    Card, CardContent,
    makeStyles, Typography,
    Button, TextField,
} from '@material-ui/core';
import { useFormik } from 'formik';
import NewCollectionSchema from '../schemas/NewCollectionSchema';
import { addCollection } from '../actions/users';
import * as yup from 'yup';
import { useDispatch } from "react-redux";
import Alert from '@material-ui/lab/Alert';

const validationSchema = yup.object().shape(NewCollectionSchema);

const useStyles = makeStyles((theme) => ({
    root: {
        margin: 5,
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
    },
    buttons: {
        marginTop: 10,
        marginBottom: 10,
    },
}));

function Collections() {
    const initialValues = {
        name: '',
    }

    const { user } = useSelector((state => state.users), shallowEqual);
    const classes = useStyles();
    const dispatch = useDispatch();

    const [alert, setAlert] = useState(null);

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,

        onSubmit: (values) => {
            const response = dispatch(addCollection(user.username, { user_id: user.id, name: values.name }))
            response.then((res) => {
                if (res.username) {
                    setAlert(null);
                    formik.resetForm();
                } else {
                    setAlert(res[0]);
                }
            })

        },
    });
    return (
        <>
            {user && <Typography variant="h2">
                {user.username}'s Collections
            </Typography>}
            <Card className={classes.root}>
                <CardContent>
                    <Typography variant="h4">
                        Add New Collection
                    </Typography>
                    {alert && <Alert severity="error">{alert}</Alert>}
                    <form onSubmit={formik.handleSubmit}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                        <Button className={classes.buttons} color="primary" variant="contained" type="submit" >
                            Add Collection
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Typography variant="h4">
                Current Collections
            </Typography>
            {user && user.collection.map((collection) => (
                <Card className={classes.root} key={"Card" + collection.id}>
                    <CardContent>
                        <CollectionGrid key={collection.id} collection={collection} username={user.username} />
                    </CardContent>
                </Card>
            ))}
        </>

    );
}

export default Collections;
