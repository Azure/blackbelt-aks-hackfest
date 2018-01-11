# Dockerizing Applications

## Build Container Images

For the first container, we will be creating a Dockerfile from scratch. For the other containers, the Dockerfiles are provided.

### Web Container

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
    ```

3. Validate image was created with `docker images`

### API Container

In this step, the Dockerfile has been created for you. 

1. Create a container image for the node.js API app

    ```
    cd ./Linux_Container_Azure_Workshop/app/api

    docker build -t rating-api .
    ```

2. Validate image was created with `docker images`

### MongoDB Container

1. Create a MongoDB image with data files

    ```
    cd ./Linux_Container_Azure_Workshop/app/db

    docker build -t rating-db .
    ```

2. Validate image was created with `docker images`


## Run Containers

### Setup Docker Network

Create a docker bridge network to allow the containers to communicate internally. 

```
docker network create --subnet=172.18.0.0/16 my-network
```

### MongoDB Container

1. Run mongo container

    ```
    docker run -d --name db --net my-network --ip 172.18.0.10 -p 27017:27017 rating-db
    ```

2. Validate by running `docker ps -a`

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

4. Type `exit` to exit out of container

### API Container

1. Run api app container

    ```
    docker run -d --name api --net my-network --ip 172.18.0.11 -p 3000:3000 rating-api
    ```

2. Validate by running `docker ps -a`

3. Test api app by browsing to http://localhost:3000/api/heroes 

### Web Container

1. Run web app container

    ```
    docker run -d --name web --net my-network \
    --ip 172.18.0.12 -p 8080:8080 \
    -e "API=http://localhost:3000/api" \
    -e "SITE=http://localhost:8080/static/data/site.json" \
    -e "HEROES=http://localhost:8080/static/data/heroes.json" rating-web
    ```

    > Note that environment variables are used here to direct the web page to necessary components.

2. Validate by running `docker ps -a`

3. Test web app by browsing to http://localhost:8080


## Azure Container Registry (ACR)

Now that we have container images for our application components, we need to store them in a secure, central location. In this lab we will use Azure Container Registry for this.

1. Create Azure Container Registry instance

    * In the browser, sign in to the Azure portal at https://portal.azure.com
    * Click "Create a resource" and select "Azure Container Registry"
    * Provide a name for your registry (this must be unique)
    * Use a new Resource Group
    * Enable the Admin user
    * Use the 'Standard' SKU (default)


    > The Standard registry offers the same capabilities as Basic, but with increased storage limits and image throughput. Standard registries should satisfy the needs of most production scenarios.

2. Login to your ACR with Docker

    * Browse to your Container Registry in the Azure Portal
    * Click on "Access keys"
    * Make note of the "Login server", "Username", and "password"
    * Login in your Bash shell: 


    ```
    docker login --username <username> --password <password> <login server>
    ```

3. Tag images with ACR server and repository (be sure to replace the login server value)

    ```
    docker tag rating-db <login server>/azureworkshop/rating-db:v1
    docker tag rating-api <login server>/azureworkshop/rating-api:v1
    docker tag rating-web <login server>/azureworkshop/rating-web:v1
    ```

3. Push images to registry

    ```
    docker push <login server>/azureworkshop/rating-db:v1
    docker push <login server>/azureworkshop/rating-api:v1
    docker push <login server>/azureworkshop/rating-web:v1
    ```

    Output from a successful `docker push` command is similar to:

    ```
    The push refers to a repository [mycontainerregistry.azurecr.io/azureworkshop/rating-db]
    035c23fa7393: Pushed
    9c2d2977a0f4: Pushed
    d7b18f71e002: Pushed
    ec41608c0258: Pushed
    ea882d709aca: Pushed
    74bae5e77d80: Pushed
    9cc75948c0bd: Pushed
    fc8be3acfc2d: Pushed
    f2749fe0b821: Pushed
    ddad740d98a1: Pushed
    eb228bcf2537: Pushed
    dbc5f877c367: Pushed
    cfce7a8ae632: Pushed
    v1: digest: sha256:f84eba148dfe244f8f8ad0d4ea57ebf82b6ff41f27a903cbb7e3fbe377bb290a size: 3028
    ```

4. Validate images in Azure

    * Return to the Azure Portal in your browser and validate that the images appear in your Container Registry under the "Repositories" area.
    * Under tags, you will see "v1" listed.
