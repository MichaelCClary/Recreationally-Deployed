import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";


class RecreationallyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${RecreationallyApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }
  // Get user
  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  // signup new user, returns user
  static async signup(data) {
    let res = await this.request(`auth/register`, data, 'post');
    return res.token;
  }

  // login, get new token
  static async login(data) {
    let res = await this.request(`auth/token`, data, 'post');
    return res.token;
  }

  // edit user
  static async editUser(username, data) {
    let res = await this.request(`users/${username}`, data, 'patch');
    return res.user;
  }

  // add new collection to user
  static async addCollection(username, data) {
    let res = await this.request(`users/${username}/collection`, data, 'post');
    return res;
  }

  // deletes collection
  static async deleteCollection(username, data) {
    let res = await this.request(`users/${username}/collection`, data, 'delete');
    return res;
  }

  // adds park to collection
  static async addParkToCollection(username, data) {
    let res = await this.request(`users/${username}/collection/park`, data, 'post');
    return res;
  }

  // removes park from collection
  static async removeParkFromCollection(username, data) {
    let res = await this.request(`users/${username}/collection/park`, data, 'delete');
    return res;
  }

  // search parks
  static async searchParksDB(data) {
    let res = await this.request(`parks/search`, data);
    return res;
  }

  //get activities
  static async getActivitiesFromDB() {
    let res = await this.request(`parks/activities`);
    return res;
  }

  //get topics
  static async getTopicsFromDB() {
    let res = await this.request(`parks/topics`);
    return res;
  }

  //get random park
  static async getRandomPark() {
    let res = await this.request(`parks/random`);
    return res;
  }

  //get park by parkCode
  static async getParkByParkCode(parkCode) {
    let res = await this.request(`parks/${parkCode}`);
    return res;
  }

  //get parks by activities
  static async getParksByActivity(activityID) {
    let res = await this.request(`parks/activities/${activityID}`);
    return res;
  }

  //get parks by topics
  static async getParksByTopic(topicID) {
    let res = await this.request(`parks/topics/${topicID}`);
    return res;
  }

}


export default RecreationallyApi;