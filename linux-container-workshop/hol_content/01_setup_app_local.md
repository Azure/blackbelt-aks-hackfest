# Initial Setup and Running App on Local Machine

## Clone Lab Github Repo

The lab files must be cloned to the local machine to complete all of the exercises for the day. 

* Open a terminal on the jumpbox
* Clone the Github repo

    ```
    git clone https://github.com/Azure/blackbelt-aks-hackfest.git
    ```

## Run Applications

### MongoDB

Mongo is already running. We need to import the data for our application.

    ```
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/db

    mongoimport --host localhost:27019 --db webratings --collection heroes --type json --file ./heroes.json --jsonArray
    mongoimport --host localhost:27019 --db webratings --collection ratings --type json --file ./ratings.json --jsonArray
    mongoimport --host localhost:27019 --db webratings --collection sites --type json --file ./sites.json --jsonArray
    ```

### API Application

* Update dependencies and run app via node

    ```
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/api

    npm install && npm run localmachine
    ```

* Test api locally http://localhost:3000/api/heroes 

### Web Application

* Open a new Terminal session
* Update dependencies and run app via node

    ```
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/app/web

    npm install && npm run localmachine
    ```

* Test web locally http://localhost:8080 

## Clean-up

Close or `ctrl-c` out of web and app applications.
