# Initial Setup and Running App on Local Machine(Jumpbox)

## Work Environment

There are two environments you will be working in for the exercises today.

1. **Jumpbox:** The apps and containers must be run on a Linux machine. Use your newly created [Jumpbox](/labs/day1-labs/00-lab-environment.md) for this exercise.

    > Note: If you have bash or ssh available on your machine, it is easiest to access the jump box via SSH. 
    
2. **Azure Cloud Shell:** The Azure Cloud Shell will be accessed by logging into the Azure Portal (http://portal.azure.com).

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Labs 1 and 2 require the Jumpbox.**

## Clone Lab Github Repo

Once you have accessed the jumpbox, you must clone the workshop repo to the machine.

1. Start with a terminal on the jumpbox
  
2. Clone the Github repo via the command line

    ```
    git clone https://github.com/heoelri/container-bootcamp.git
    ```

## Get Applications up and running

### Database layer - MongoDB

The underlying data store for the app is [MongoDB](https://www.mongodb.com/ "MongoDB Homepage"). It is already running(we installed MongoDB during Jumpbox setup). We need to import the data for our application.

1. Import the data using a terminal session on the jumpbox

    ```bash
    cd ~/container-bootcamp/app/db

    mongoimport --host localhost:27019 --db webratings --collection heroes --file ./heroes.json --jsonArray 
    mongoimport --host localhost:27019 --db webratings --collection ratings --file ./ratings.json --jsonArray
    mongoimport --host localhost:27019 --db webratings --collection sites --file ./sites.json --jsonArray
    ```

### API Application layer - Node.js

The API for the app is written in javascript, running on [Node.js](https://nodejs.org/en/ "Node.js Homepage") and [Express](http://expressjs.com/ "Express Homepage")

1. Update dependencies and run app via node in a terminal session on the jumpbox

    ```bash
    cd ~/container-bootcamp/app/api

    sudo npm install && npm run localmachine
    ```
    
   The terminal will show the message saying ``` CONNECTED TO mongodb://localhost:27019/webratings ``` 
   
   **Leave the terminal session open as such and proceed to next step. A new session to the Jumpbox needs to be opened in parallel in the next step**

2. Open a new terminal session on the jumpbox and test the API

    use curl
    ```bash
    curl http://localhost:3000/api/heroes
    ```
    
### Web Application layer - Vue.js, Node.js

The web frontend for the app is written in [Vue.js](https://vuejs.org/Vue "Vue.js Homepage"), running on [Node.js](https://nodejs.org/en/ "Node.js Homepage") with [Webpack](https://webpack.js.org/ "Webpack Homepage")

1. Open a new terminal session on the jumpbox
**This will most likely be a third terminal session that will be opened**
  
2. Update dependencies and run app via node

    ```bash
    cd ~/container-bootcamp/app/web

    sudo npm install -f && npm run localmachine
    ```
    
3. Test the web front-end

    To test the web front-end via the internet you've to grab your ip address from the Azure Portal and enable access to port 8080.
    
    * Goto portal.azure.com
    * Select your Jumpbox VM
    * Goto Networking
    * Select 'Add inbound'
    * Add a new inbound security rule for Port 8080/TCP
       

    You can test the web app from a new terminal session in the jumpbox
    
    ```bash
    curl http://localhost:8080
    ```

## Clean-up

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) > **Important!** Make sure to close the web and api apps in the terminal windows by hitting `ctrl-c` in each of the corresponding terminal windows to avoid port conflict issues in the next excercise. 



   ##### [Return to BootCamp Table of Contents (Main Page)](/README.md)
