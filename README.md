<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Thanks again! Now go create something AMAZING! :D
***
***
***
*** To avoid retyping too much info. Do a search and replace for the following:
*** MichaelCClary, CapstoneOne, twitter_handle, MichaelCClary@gmail.com, The Vault, project_description
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/MichaelCClary/Recreationally-Deployed">
    <!-- <img src="images/logo.png" alt="Logo" width="80" height="80"> -->
    Recreationally
  </a>

  <h3 align="center">Recreationally</h3>

  <p align="center">
    This is a simple website to search for through the national park service and find new parks that meet different criteria.  You can browse by different activities, topics, state, or search by name/description.  I hope you enjoy playing around with it as much as I did making it.  Please let me know if there are any improvements/bugs for me to make.  I plan to keep working on this to make it better and better.
    <br />
    <a href="https://github.com/MichaelCClary/Recreationally-Deployed"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://level-exchange.surge.sh/">View Demo</a>
    ·
    <a href="https://github.com/MichaelCClary/Recreationally-Deployed/issues">Report Bug</a>
    ·
    <a href="https://github.com/MichaelCClary/Recreationally-Deployed/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#user-flow">User Flow</a></li>
      </ul>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <!-- <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
I wanted to make this to help me find places to go hiking with my daughter.  Where we live is not very good for walking so I thought it would be nice to be able to search for hiking areas near to me.  I used the national park service API to be able to comb through their records and thought it would be a great way to plan a trip or just find out what parks offer what activities and topics.

This is my final capstone project with Springboard.
I built the backend with node using express and psql for a database. I used React, Material Ui, formik, and yup for front end.  I used Redux for the state management but I am in the process of removing it due to not liking how it functions and wanting to simplify my stack a little bit.

Every search hits the api to get games and homepage is a basic search of most popular games.  When you click on more information or add a game to your collection, then it is added to the database.  

The search function was tricky because the api wouldn't let you search for say a name and a category at the same time.  It is a browse the category and search by name.  The categories/mechanics/players are in a select drop down menu for easy finding.

I used Javascript to let you add/remove games from your collection without reloading page and to handle hiding search boxes you weren't currently using.

Material ui was used to help layout the page and give me building blocks/style elements.  It was not included with the course work but I really wanted to learn it.  

Special thank you to National Park Service for their API which has is a great source of information and shows how much they really do.  I honestly had no idea there were almost 500 national parks.

Special thank you to my mentor Philip who helped me get trhough all this and tell me how to improve my ui at every turn.

## User Flow
1. User will go to home page which displays a random park and can be refreshed/random button clicked to change button
2. User can login/signup and be redirected back to homepage.
3. User can then search/browse for parks in several ways from links in navbar
4. Any time user wants more information on a park, they just click more Park Detail Page button.
5. User can check their collections at any time by clicking on the user icon from nav bar
6. User can edit their email address/password from their profile
7. User can add to collections from any park with add to collections button if signed in.

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->
<!-- 
Here's a blank template to get started:
**To avoid retyping too much info. Do a search and replace with your text editor for the following:**
`MichaelCClary`, `CapstoneOne`, `twitter_handle`, `MichaelCClary@gmail.com`, `The Vault`, `project_description` -->


### Built With

* [Node](https://nodejs.org/en/)
* [Express](https://expressjs.com/)
* [React](https://reactjs.org/)
* [Material Ui](https://mui.com/)
* [PSQL](https://www.postgresql.org/)
* [Yup](https://www.npmjs.com/package/yup)
* [Formik](https://formik.org/)
* [Axios](https://github.com/axios/axios)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

* Install node
* Install PSQL and setup database with recreationaly.sql as your schema design

### Installation
Please let me know if you have any trouble or anything is not clear and I will try my best

1. Clone the repo
   ```sh
   git clone https://github.com/MichaelCClary/Recreationally-Deployed.git
   ```
2. cd into backend folder and install packages
   ```sh
   npm install
   ```   
3. Get a free API key at https://www.nps.gov/subjects/developer/get-started.htm

4. create a .env file and Enter your API in .env
   ```sh
   API_KEY = I am an API Key
   ```
5. Enter your SECRET_KEY in .env
   ```sh
   SECRET_KEY = I am a secret key
   ```
6. Run from terminal
   ```sh
   node server.js
   ```
7. In a seperate terminal cd into frontend folder and install packages
   ```sh
   npm install
   ```
8. Start up front end server with react   
   ```sh
   npm start
   ```


<!-- ROADMAP -->
## Roadmap

<!-- See the [open issues](https://github.com/MichaelCClary/CapstoneOne/issues) for a list of proposed features (and known issues). -->

Current - high priority features
* Adding Campgrounds
* adding alerts from parks
* Add lesson plans from api
* A way to organize/reorder your collections
* Pagination of search results

Some more distance features
* Think of better names for collections
* Think of better names for everything else?
* Directions to parks
* Friends/friends list
* Share Collections
* Comments on parks
* A petting zoo
* Chocolate Milk fountain?

<!-- CONTRIBUTING -->
<!-- ## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Email me if you have something you want me to add/a bug to fix and I will do my best.

<!-- LICENSE -->
<!-- ## License

Distributed under the MIT License. See `LICENSE` for more information. -->


<!-- CONTACT -->
## Contact

Michael Clary - <!--[@twitter_handle](https://twitter.com/twitter_handle) --> - MichaelCClary@gmail.com

Project Link: [https://github.com/MichaelCClary/Recreationally-Deployed](https://github.com/MichaelCClary/Recreationally-Deployed)



<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Heroku](heroku.com)
* [National Park Services](https://www.nps.gov/index.htm)
* [othneildrew](https://github.com/othneildrew/Best-README-Template)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/MichaelCClary/Recreationally-Deployed.svg?style=for-the-badge
[contributors-url]: https://github.com/MichaelCClary/Recreationally-Deployed/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/MichaelCClary/Recreationally-Deployed.svg?style=for-the-badge
[forks-url]: https://github.com/MichaelCClary/Recreationally-Deployed/network/members
[stars-shield]: https://img.shields.io/github/stars/MichaelCClary/Recreationally-Deployed.svg?style=for-the-badge
[stars-url]: https://github.com/MichaelCClary/Recreationally-Deployed/stargazers
[issues-shield]: https://img.shields.io/github/issues/MichaelCClary/Recreationally-Deployed.svg?style=for-the-badge
[issues-url]: https://github.com/MichaelCClary/Recreationally-Deployed/issues
[license-shield]: https://img.shields.io/github/license/MichaelCClary/Recreationally-Deployed.svg?style=for-the-badge
[license-url]: https://github.com/MichaelCClary/Recreationally-Deployed/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/MichaelCClary

