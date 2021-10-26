import React, { useState } from "react";
import { useFormik } from 'formik';
import {
    Button, Container, TextField, makeStyles,
    InputAdornment, IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import EditProfileSchema from '../schemas/EditProfileSchema';
import { useDispatch } from "react-redux";
import { editUser } from '../actions/users';
import { useHistory } from 'react-router-dom'
import * as yup from 'yup';
import {
    Visibility, VisibilityOff
} from '@material-ui/icons';
import { shallowEqual, useSelector } from "react-redux";

const validationSchema = yup.object().shape(EditProfileSchema);

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});

function EditProfile() {
    const { user } = useSelector((state => state.users), shallowEqual);

    const initialValues = {
        password: '',
        email: user.email,
        showPassword: false,
    }

    const [alert, setAlert] = useState(null);
    const [values, setValues] = React.useState(initialValues);
    const dispatch = useDispatch();
    const history = useHistory();
    const classes = useStyles();

    const handleCancel = () => {
        history.push('/')
    }
    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: validationSchema,

        onSubmit: (values) => {
            let editedUser = { email: values.email };

            if (values.password.length > 4) {
                editedUser.password = values.password;
            }

            const response = dispatch(editUser(user.username, editedUser))
            response.then((res) => {
                if (res.username) {
                    setAlert(null)
                    history.push('/')
                } else {
                    setAlert(res[0])
                }
            })

        },
    });

    return (
        <Container maxWidth="sm">
            <h2>Edit {user.username}'s Profile</h2>
            {alert && <Alert severity="error">{alert}</Alert>}
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="password"
                    name="password"
                    label="Password"
                    type={values.showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    error={formik.touched.password && Boolean(formik.errors.password)}
                    helperText={formik.touched.password && formik.errors.password}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                />
                <Button className={classes.buttons} color="primary" variant="contained" fullWidth type="submit" >
                    Submit
                </Button>
            </form>
            <Button className={classes.buttons} color="secondary" variant="contained" fullWidth type="button" onClick={handleCancel}>
                Cancel
            </Button>
        </Container >
    );
};

export default EditProfile;