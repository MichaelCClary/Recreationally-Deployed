//All routes for file, routes you to different URLS with react-router

import React from "react";
import { Switch, Route } from "react-router-dom";
import Homepage from "./parkRoutes/Homepage";
import Login from "./userRoutes/Login";
import Logout from "./userRoutes/Logout";
import Signup from "./userRoutes/Signup";
import EditProfile from "./userRoutes/EditProfile";
import SearchParks from "./parkRoutes/SearchParks";
import ParkInfoLogic from "./parkRoutes/ParkInfoLogic";
import ParksByActivity from "./parkRoutes/ParksByActivity";
import ParksByTopic from "./parkRoutes/ParksbyTopic";
import ScrollToTop from './ScrollToTop';
import Activities from "./parkRoutes/Activities";
import Topics from "./parkRoutes/Topics";
import Collections from "./userRoutes/Collections"

function Routes() {
  return (
    <>
      <ScrollToTop />
      <Switch>
        <Route exact path="/">
          <Homepage />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/logout">
          <Logout />
        </Route>
        <Route exact path="/signup">
          <Signup />
        </Route>
        <Route exact path="/collections">
          <Collections />
        </Route>
        <Route exact path="/profile/edit">
          <EditProfile />
        </Route>
        <Route exact path="/parks/search">
          <SearchParks />
        </Route>
        <Route exact path="/parks/activities">
          <Activities />
        </Route>
        <Route path="/parks/activities/:activityName">
          <ParksByActivity />
        </Route>
        <Route exact path="/parks/topics">
          <Topics />
        </Route>
        <Route exact path="/parks/topics/:topicName">
          <ParksByTopic />
        </Route>
        <Route exact path="/parks/:parkCode">
          <ParkInfoLogic />
        </Route>
      </Switch>
    </>
  );
}

export default Routes;
