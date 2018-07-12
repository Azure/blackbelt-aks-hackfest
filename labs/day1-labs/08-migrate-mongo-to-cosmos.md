# Migrate Data from MongoDB to Azure Cosmos DB

In this section we will be creating a CosmosDB instance in your Azure account to migrate/export your MongoDB data to CosmosDB.  You can use CosmosDB as a drop in replacement for MongoDB, since CosmosDB uses a MongoDB compatibale API.  As such, you are only required to replace/change the MongoDB URI connection string with one supplied by CosmosDB in the dashboard. 

## Deploy Azure CosmosDB

1. Create a CosmosDB instance in Azure

* Open the Azure Portal.  ```https://portal.azure.com```
* Click on ```Create a Resource``` in the top left corner of the portal
* Type "azure cosmos db" in the ```search marketplace``` search field and select ```Azure Cosmos DB``` in the results
* Click the blue ```Create``` button at the bottom of the new blade that appears

![Finding CosmosDB in the Azure Portal](img/finding_cosmos.png "Finding CosmosDB in the Azure Portal")

* Fill in the following information:

	- ```ID``` - This must be unique and lower case. You can likely use your last name and heroes, eg - ```myname-heroes```
	- ```API```- The API to use to access your CosmosDB - this can be one of [```SQL```, ```MongoDB```, ```Cassandra```, ```Azure Table```, ```Gremlin```] and corresponds with the underlying data model types for each protocol.  We will choose ```MongoDB``` for this lab.
	- ```Subscription``` - If you have multiple Azure subscriptions/accounts you may choose which one to deploy to.
	- ```Resource Group```- Select ```Use existing``` and pick your resource group.
	- ```Location``` - Azure region for CosmosDB. We will use ```East US```

		![Creating CosmosDB in the Azure Portal](img/creating_cosmos.png "Creating CosmosDB in the Azure Portal")

* Click ```Create```. Your CosmosDB instance will be provisioned within minutes.  You will be notified with an alert in the top right corner of your Portal Dashboard.

2. Modify CosmosDB settings

* Click on your CosmosDB resource in the Azure Portal
* Click on ```Preview Features```
* Click Enable on ```MongoDB Aggregation Pipeline``` and wait for this to be completed.

## Migrating Data From MongoDB to CosmosDB

In this section we will use the ```mongodump``` and ```mongorestore``` commands to export data from MongoDB and then import back into CosmosDB.  

> The method used in this section is simple by design and may not be the right method for your production migrations.  We would recommend working with a MongoDB DBA and Architect who is experienced with MongoDB data migration in a production environment to minimize downtime.  Please refer to: [Guide for a successful migration
](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-migrate#guide-for-a-successful-migration) in the Azure Docs for CosmosDB.

1. Exec into mongoDB pod and export data
	```bash
	# list pods in the cluster and set the variable to your pod name
	kubectl get pod
	NAME                                                              READY     STATUS    RESTARTS   AGE
	heroes-api-deploy-1140957751-v2pqc                                1/1       Running   0          20h
	heroes-db-deploy-2357291595-xb4xm                                 1/1       Running   0          20h
	heroes-web-3683626428-9m8wp                                       1/1       Running   0          20h

	MONGO_POD=heroes-db-deploy-2357291595-xb4xm

	kubectl exec -it $MONGO_POD bash

	root@heroes-db-deploy-2357291595-xb4xm:/# mongodump

	# validate the the export was successful
	root@heroes-db-deploy-6ccb88c7bc-cfmqh:/# ls -la dump
	total 16
	drwxr-xr-x 4 root root 4096 Feb 10 12:01 .
	drwxr-xr-x 1 root root 4096 Feb 10 12:01 ..
	drwxr-xr-x 2 root root 4096 Feb 10 12:01 admin
	drwxr-xr-x 2 root root 4096 Feb 10 12:01 webratings

	```

	_Do not exit the pod. Step 3 will be run from the same location._

2. Retrieve the CosmosDB connection details from the Azure Portal

	Click on ```Connection String``` and make note of the ```HOST```,```USERNAME```, and ```PRIMARY PASSWORD```

3. Import the data using ```mongorestore```
	
	From the same prompt inside the pod, set the variables below and run the command

	```bash
	# set the below environment variables inside the mongoDB pod
	HOST=
	USER_NAME=
	PASSWORD=

	mongorestore --host $HOST:10255 -u $USER_NAME -p $PASSWORD --db heroratings --ssl --sslAllowInvalidCertificates /dump/webratings

	# you should see results as below:

	018-02-10T12:08:24.184+0000	building a list of collections to restore from /dump/webratings dir
	2018-02-10T12:08:24.228+0000	reading metadata for heroratings.ratings from /dump/webratings/ratings.metadata.json
	2018-02-10T12:08:24.275+0000	reading metadata for heroratings.sites from /dump/webratings/sites.metadata.json
	2018-02-10T12:08:24.320+0000	reading metadata for heroratings.heroes from /dump/webratings/heroes.metadata.json
	2018-02-10T12:08:25.270+0000	restoring heroratings.heroes from /dump/webratings/heroes.bson
	2018-02-10T12:08:25.363+0000	no indexes to restore
	2018-02-10T12:08:25.363+0000	finished restoring heroratings.heroes (4 documents)
	2018-02-10T12:08:25.484+0000	restoring heroratings.sites from /dump/webratings/sites.bson
	2018-02-10T12:08:25.506+0000	restoring heroratings.ratings from /dump/webratings/ratings.bson
	2018-02-10T12:08:25.552+0000	no indexes to restore
	2018-02-10T12:08:25.552+0000	finished restoring heroratings.sites (2 documents)
	2018-02-10T12:08:25.700+0000	no indexes to restore
	2018-02-10T12:08:25.700+0000	finished restoring heroratings.ratings (76 documents)
	2018-02-10T12:08:25.700+0000	done
	```
4. Exit from pod by typing `exit`

5. View data the Azure Portal

	When you navigate to your CosmosDB instance in the Azure portal, you can view your Database, Collections and Documents by navigating to the "Data Explorer" section of your CosmosDB instance.  You can perform CRUD, Query and other operations on your database here as well.

	![Cosmos Data Explorer](img/cosmos_data_explorer.png "Cosmos Data Explorer")

## Update the Heroes App to use CosmosDB

1. Create your CosmosDB connection string

* The connection string takes the format: ```mongodb://<username>:<password>@<cosmosdb-url>:10255/<dbname>?ssl=true```

* Set the following as environment variables. You can obtain these in the Azure Portal for your CosmosDB instance in the ```Connection String``` tab. 

	> Note that we must set these again because in the earlier step, they were set inside the mongoDB pod. You should be at a shell prompt in the **Azure Cloud Shell** for this step.

	```bash
	# update the lines below with your config details
	HOST=
	USER_NAME=
	PASSWORD=

	CONNECT_STRING=mongodb://$USER_NAME:$PASSWORD@$HOST:10255/heroratings?ssl=true

	echo $CONNECT_STRING

	mongodb://username:biglongpassword@host.documents.azure.com:10255/heroratings?ssl=true

	# make note of this. you will use this value in the next step
	```

2. Update the API deployment to use the new CosmosDB connect string

* Edit the `heroes-web-api.yaml` file in `helper-files`
	The snippet below is the section that must be udpated. We are replacing the `MONGODB_URI` value with the new connect string created in the prior section
	
	```bash
	cd ~/blackbelt-aks-hackfest/labs/helper-files
	vi heroes-web-api.yaml
	```
	
	```yaml
	env:
	- name:  MONGODB_URI
		value: mongodb://username:biglongpassword@host.documents.azure.com:10255/heroratings?ssl=true
	ports:
	- containerPort:  3000
		name:  heroes-api
	imagePullPolicy: Always
	restartPolicy: Always
	```

* Apply the new config in AKS
	```bash
	kubectl apply -f heroes-web-api.yaml

	# if you look at the pods right away, you will see a new api pod being created
	
	kubectl get pods
	NAME                                 READY     STATUS              RESTARTS   AGE
	heroes-api-deploy-599cdf4977-8g6vc   0/1       Terminating         0          42m
	heroes-api-deploy-6ccd9997fc-5xlwv   0/1       ContainerCreating   0          3s
	heroes-db-deploy-6ccb88c7bc-cfmqh    1/1       Running             0          44m
	heroes-web-deploy-7994bc4856-pdvdf   1/1       Running             0          42m
	```

## Test the Application

* Browse to your heroes web app using the public IP from the below command and validate the leaderboard

	```bash
	kubectl get service
	NAME    TYPE           CLUSTER-IP     EXTERNAL-IP          PORT(S)          AGE
	web     LoadBalancer   10.0.115.59    <your external ip>   8080:30112/TCP   12d
	```
	
* Submit some new ratings and validate the same in the CosmosDB Data Explorer. You should see the number of ratings documents increase
* Delete the MongoDB pod

	Just for the fun of it, delete your MongoDB pod and ensure your app is now connected to a PaaS-based data layer. 

	```bash
	kubectl get deploy

	NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
	heroes-api-deploy   1         1         1            1           10m
	heroes-db-deploy    1         1         1            1           30m
	heroes-web          1         1         1            1           10m

	kubectl delete -f heroes-db.yaml
	```
