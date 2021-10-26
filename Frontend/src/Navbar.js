import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react';
import { shallowEqual, useSelector, useDispatch } from "react-redux";
import RecreationallyApi from './api';
import { setUpParksForApp } from './actions/parks';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function Navbar() {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [anchorNav, setAnchorNav] = React.useState(null);
    const openProfile = Boolean(anchorEl);
    const openNav = Boolean(anchorNav);
    const history = useHistory();
    const dispatch = useDispatch();

    const { user, token } = useSelector((state => state.users), shallowEqual);
    if (token) RecreationallyApi.token = token;

    useEffect(() => {
        dispatch(setUpParksForApp())
    }, [])

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNav = (event) => {
        setAnchorNav(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setAnchorNav(null);
    };

    const handleLink = (url) => {
        setAnchorEl(null);
        setAnchorNav(null);
        history.push(url);
    }

    return (
        <div className={classes.root}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleNav}
                        color="inherit"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        id="nav-appbar"
                        anchorEl={anchorNav}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        open={openNav}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => handleLink("/")}>Home</MenuItem>
                        <MenuItem onClick={() => handleLink("/parks/search")}>Search Parks</MenuItem>
                        <MenuItem onClick={() => handleLink("/parks/activities")}>Parks By Activity</MenuItem>
                        <MenuItem onClick={() => handleLink("/parks/topics")}>Parks By Topic</MenuItem>
                    </Menu>
                    <Typography variant="h6" className={classes.title}>
                        Recreationally
                    </Typography>
                    {user && (
                        <div>
                            <IconButton
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={handleMenu}
                                color="inherit"
                            >
                                <AccountCircle />
                            </IconButton>
                            <Menu
                                id="menu-appbar"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={openProfile}
                                onClose={handleClose}
                            >
                                <MenuItem onClick={() => handleLink("/collections")}>Collections</MenuItem>
                                <MenuItem onClick={() => handleLink("/profile/edit")}>Edit Profile</MenuItem>
                                <MenuItem onClick={() => handleLink("/logout")}>Logout</MenuItem>
                            </Menu>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <div>
                                <MenuItem onClick={() => handleLink("/login")}>Login</MenuItem>
                            </div>
                            <div>
                                <MenuItem onClick={() => handleLink("/signup")}>Signup</MenuItem>
                            </div>
                        </div>
                    )}
                </Toolbar>
            </AppBar>
        </div >
    );
}


export default Navbar;