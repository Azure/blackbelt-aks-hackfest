# Initial Setup and Running App on Local Machine

## Clone Lab Github Repo

The lab files must be cloned to the local machine to complete all of the exercises for the day. 

* Open a terminal on the jumpbox to bring up a command line
* Clone the Github repo via the command line

    ```bash
    git clone https://github.com/Azure/blackbelt-aks-hackfest.git
    ```

## Get Applications up and running

### Database layer - MongoDB

The underlying data store for the app is [MongoDB](https://www.mongodb.com/ "MongoDB Homepage"). It is already running. We need to import the data for our application.

* Import the data via the command line

    ```bash
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/db

    mongoimport --host localhost:27019 --db webratings --collection heroes --type json --file ./heroes.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection ratings --type json --file ./ratings.json --jsonArray && mongoimport --host localhost:27019 --db webratings --collection sites --type json --file ./sites.json --jsonArray
    ```

### API Application layer - Node.js

The API for the app is written in javascript, running on [Node.js](https://nodejs.org/en/ "Node.js Homepage") and [Express](http://expressjs.com/ "Express Homepage")

* Update dependencies and run app via node in the command line

    ```bash
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/api

    npm install && npm run localmachine
    ```

* Test the API locally either

    using curl in the command line
    ```bash
    curl http://localhost:3000/api/heroes
    ```
    or use the browser on the jumpbox and navigate to <http://localhost:3000/api/heroes>

### Web Application layer - Vue.js, Node.js

The web frontend for the app is written in [Vue.js](https://vuejs.org/Vue "Vue.js Homepage"), running on [Node.js](https://nodejs.org/en/ "Node.js Homepage") with [Webpack](https://webpack.js.org/ "Webpack Homepage")

* Open a new Terminal session
* Update dependencies and run app via node

    ```bash
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/web

    npm install && npm run localmachine
    ```

* Test web locally

    use the browser on the jumpbox and navigate to <http://localhost:8080>

## Clean-up

* Close the web and api apps in the terminal windows by hitting `ctrl-c` in each of the corresponding terminal windows