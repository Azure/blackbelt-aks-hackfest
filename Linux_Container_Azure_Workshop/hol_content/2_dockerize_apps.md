# Dockerizing Applications

## Web Container

For the first container, we will be creating a Dockerfile from scratch. For the other containers, the Dockerfiles are provided.

1. Create a Dockerfile

    * Open Visual Studio Code
    * In the "Linux_Container_Azure_Workshop/app/web" directory, add a file called "Dockerfile"
    * Add the following lines and save:

        ```
        FROM node:carbon

        WORKDIR /usr/src/app
        COPY package*.json ./
        RUN npm install

        COPY . .

        EXPOSE 8080

        CMD [ "npm", "run", "staging" ]
        ```

2. Create a container image for the node.js Web app

    From bash shell: 

    ```
    cd ./Linux_Container_Azure_Workshop/app/web

    docker build -t rating-web .

    # validate the image is created
    docker images
    ```

3. Run web app container

    ```
    docker run -d --name web -p 8080:8080 rating-web

    # validate the container is running
    docker ps -a
    ```

4. Test web app by browsing to http://localhost:8080

    You should see a base web page load with some links, but the full page will render after the next few steps.

## API Container

In this step, the Dockerfile has been created for you. 

1. Create a container image for the node.js API app

    ```
    cd ./Linux_Container_Azure_Workshop/app/api

    docker build -t rating-api .

    # validate the image is created
    docker images
    ```

2. Run api app container

    ```
    docker run -d --name api -p 3000:3000 rating-api

    # validate the container is running
    docker ps -a
    ```

3. Test api app by browsing to http://localhost:3000 

## MongoDB Container

1. Create a MongoDB image with data files

    ```
    cd ./Linux_Container_Azure_Workshop/app/db

    docker build -t rating-db .

    # validate the image is created
    docker images
    ```

2. Run mongo container

    ```
    docker run -d --name db -p 27017:27017 mongoratings

    # validate the container is running
    docker ps -a
    ```

3. Import data into database

    ```
    docker exec -it db bash
    ```

    You will have a prompt inside the mongo container. From that prompt, run the import script (`./import.sh`)

    ```
    root@61f9894538d0:/# ./import.sh
    2018-01-10T19:26:07.746+0000	connected to: localhost
    2018-01-10T19:26:07.761+0000	imported 4 documents
    2018-01-10T19:26:07.776+0000	connected to: localhost
    2018-01-10T19:26:07.787+0000	imported 72 documents
    ```

## Azure Container Registry (ACR)

Now that we have container images for our application components, we need to store them in a secure, central location. In this lab we will use Azure Container Registry for this.

1. Create Azure Container Registry instance


2. Tag images with repository


3. Push images to registry


4. Validate

