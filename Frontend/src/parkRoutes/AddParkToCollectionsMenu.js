import React, { useState } from 'react';
import { Button, Menu, MenuItem, makeStyles, TextField } from '@material-ui/core';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import { addParkToCollection, newCollectionAndAddPark } from '../actions/users';
import AddParkToCollectionsMenuItem from './AddParkToCollectionMenuItem';
import { useFormik } from 'formik';
import NewCollectionSchema from '../schemas/NewCollectionSchema';
import * as yup from 'yup';
import Alert from '@material-ui/lab/Alert';

const validationSchema = yup.object().shape(NewCollectionSchema);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  paper: {
    marginRight: theme.spacing(2),
    zIndex: theme.zIndex.drawer + 10, color: '#fff',
  },
  LinkButton: {
    marginBottom: 10
  },
}));

function AddParkToCollectionsMenu({ park }) {
  const initialValues = {
    name: '',
  }
  const classes = useStyles();
  const { user } = useSelector((state => state.users), shallowEqual);
  const dispatch = useDispatch();

  const [anchorCollection, setAnchorCollection] = useState(null);
  const [alert, setAlert] = useState(null);

  const handleClick = (event) => {
    setAnchorCollection(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorCollection(null);
  };

  const handleAdd = (id) => {
    dispatch(addParkToCollection(user.username, { parkCode: park, collection_id: id }))
    setAnchorCollection(null);
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,

    onSubmit: (values) => {
      const response = dispatch(newCollectionAndAddPark(user.username, { user_id: user.id, name: values.name }, park))
      response.then((res) => {
        if (res.username) {
          setAlert(null);
          formik.resetForm();
          setAnchorCollection(null);
        } else {
          setAlert(res[0]);
        }
      })

    },
  });

  return (
    <div className={classes.root}>
      <div>
        <Button
          aria-controls="menu for"
          aria-haspopup="true"
          onClick={handleClick}
          variant="outlined"
          className={classes.LinkButton}
        >
          Add Park To Collection
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorCollection}
          keepMounted
          open={Boolean(anchorCollection)}
          onClose={handleClose}
        >
          <MenuItem >
            {alert && <Alert severity="error">{alert}</Alert>}
            <form onSubmit={formik.handleSubmit}>
              <TextField
                id="name"
                name="name"
                label="New Collection Name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
              <Button className={classes.buttons} color="primary" variant="outlined" type="submit">
                Add Collection
              </Button>
            </form>
          </MenuItem>
          {user && user.collection.map((collection) => (
            <AddParkToCollectionsMenuItem
              collection={collection}
              key={collection.id}
              park={park}
              handleAdd={handleAdd}
            />
          ))}

        </Menu>
      </div>
    </div>
  );
}

export default AddParkToCollectionsMenu;