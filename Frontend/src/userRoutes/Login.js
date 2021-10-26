import React, { useState } from "react";
import { useFormik } from 'formik';
import {
    Button, Container, TextField, makeStyles,
    InputAdornment, IconButton
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import LoginSchema from '../schemas/LoginSchema';
import { useDispatch } from "react-redux";
import { logInUser } from '../actions/users';
import { useHistory } from 'react-router-dom';
import * as yup from 'yup';
import {
    Visibility, VisibilityOff
} from '@material-ui/icons';

const validationSchema = yup.object().shape(LoginSchema);

const useStyles = makeStyles({
    buttons: {
        "margin-top": 5
    },
});

function Login() {
    const initialValues = {
        username: '',
        password: '',
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
            const response = dispatch(logInUser({ username: values.username, password: values.password }))
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
            <h2>Please Login</h2>
            {alert && <Alert severity="error">{alert}</Alert>}
            <form onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth
                    id="username"
                    name="username"
                    label="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    error={formik.touched.username && Boolean(formik.errors.username)}
                    helperText={formik.touched.username && formik.errors.username}
                />
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

export default Login;