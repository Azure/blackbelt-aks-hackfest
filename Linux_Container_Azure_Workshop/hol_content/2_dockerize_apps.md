# Dockerizing Applications

## Web Container

For the first container, we will be creating a Dockerfile from scratch. For the other containers, the Dockerfiles are provided.

1. Create a Dockerfile

a. Open Visual Studio Code
b. In the "Linux_Container_Azure_Workshop/web" directory, add a file called "Dockerfile"
c. Add the following lines:

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

```
cd ./Linux_Container_Azure_Workshop/web

docker build -t rating-web .

# validate the image is created
docker images
```

2. Run web app container

```
docker run -d --name db -p 27017:27017 rating-web

# validate the container is running
docker ps -a
```

3. Import data into database

## MongoDB container

1. Create a MongoDB image with data files

```
cd ./Linux_Container_Azure_Workshop/db

docker build -t mongoratings .

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

You will have a prompt inside the mongo container. From that prompt, run the import script (import.sh)

```
root@61f9894538d0:/# ./import.sh
2018-01-10T19:26:07.746+0000	connected to: localhost
2018-01-10T19:26:07.761+0000	imported 4 documents
2018-01-10T19:26:07.776+0000	connected to: localhost
2018-01-10T19:26:07.787+0000	imported 72 documents
```

## API container

1. Create a node.js image for the API app

```
cd ./Linux_Container_Azure_Workshop/api

docker build -t mongoratings .

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

## Create Azure Container Registry (ACR)


## Push images to ACR


