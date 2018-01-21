# Moving your data services to Hosted Data Solutions (CosmosDB)

In this section we will be creating a CosmosDB instance in your Azure account to migrate/export your MongoDB data to CosmosDB.  You can use CosmosDB as a drop in replacement for MongoDB, since CosmosDB uses a MongoDB compatibale API.  As such, you are only required to replace/change the MongoDB URI connection string with one supplied by CosmosDB in the dashboard. 

## Setup CosmosDB

You can create a CosmosDB service/instance in one (1) of two (2) ways:
1. Via the [Azure-CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) command line tool --**OR**--
2. Via the [Azure Web Portal](https://portal.azure.com)

### Method 1: via Azure-CLI

The Azure-CLI Command Line Tool is available and supported for Windows, macOS and Linux. The following uses the cross plaform Azure-CLI in a Linux bash shell to deploy an instance of CosmosDB into your Azure Subscription/Account.

Note:
- We are leveraging Linux bash environment variables to script our deployment.  You should change **ALL** the values for each variable listed to fit your preferred deployment.  As an example ```location1``` and ```location2``` should be changed to your desired Azure datacentre.
- The ```\``` slashes in the below example are used for escaping new lines for readability purposes (they are not a requirement), as such you may remove them to form a single line command.

```
# !!!Set variables for the new account, database, and collection etc.!!!
resourceGroupName='your_resource_group_from_portal'
location1='southcentralus'
location2='northcentralus'
name='someCosmosdbName'
databaseName='someDatabaseName'
collectionName='someCollectionName'

# Create a resource group
az group create \
	--name $resourceGroupName \
	--location $location1

# Create a MongoDB API Cosmos DB account
az cosmosdb create \
	--name $name \
	--kind MongoDB \
	--locations "$location1"=0 "$location2"=1 \
	--resource-group $resourceGroupName \
	--max-interval 10 \
	--max-staleness-prefix 200
```

Once you've run the above command, your CosmosDB instance will be provisioned within minutes.  When the deployment is sucessful you will see output in your terminal with information about your CosmosDB deployment.

### Method 2: via Azure Web Portal

If you prefer a more visual and guided walk through for creating an Azure CosmosDB instance, the Azure Web Portal is your best option.  You will need to open a browser and enter the address ```https://portal.azure.com```.

Your portal should look something like the following image:

![Azure Portal](img/azure_portal.png "Azure Portal")

You will then need to navigate in the portal and do the following:

1. Click on ```Create a Resource``` in the top left corner of the portal
2. Type "azure cosmos db" in the ```search marketplace``` search field and select ```Azure Cosmos DB``` in the results
3. Click the blue ```Create``` button at the bottom of the new blade that appears

![Finding CosmosDB in the Azure Portal](img/finding_cosmos.png "Finding CosmosDB in the Azure Portal")

You will now be able to fill in a form to deploy your CosmosDB instance.

You will need to fill in the following information:

1. ```ID``` - The unique name to give to your Azure CosmosDB account
2. ```API```- The API to use to access your CosmosDB - this can be one of [```SQL```, ```MongoDB```, ```Cassandra```, ```Azure Table```, ```Gremlin```] and corresponds with the underlying data model types for each protocol.  We will choose ```MongoDB``` for this lab.
3. ```Subscription``` - If you have multiple Azure subscriptions/accounts you may choose which one to deploy to.
4. ```Resource Group```- The name of an exisiting or new resource group to deploy your CosmosDB instance into.  This helps to keep your resources organized (think of it as a logical naming space like a folder/directory).
5. ```Location``` - The Datacentre you wish to deploy to e.g. ```Canada Central```

![Creating CosmosDB in the Azure Portal](img/creating_cosmos.png "Creating CosmosDB in the Azure Portal")

Once you've clicked create, your CosmosDB instance will be provisioned within minutes.  You will be notified with an alert in the top right corner of your Portal Dashboard.

## Migrating Data From MongoDB to CosmosDB

In this section we will use the ```mongodump``` and ```mongorestore``` commands to export data from MongoDB and then import back into CosmosDB.  

The method used in this section is simple by design and may not be the right method for your production migrations.  We would recommend working with a MongoDB DBA and Architect who is experienced with MongoDB data migration in a production environment to minimize downtime.  Please refer to: [Guide for a successful migration
](https://docs.microsoft.com/en-us/azure/cosmos-db/mongodb-migrate#guide-for-a-successful-migration) in the Azure Docs for CosmosDB.

### Export/Import Data

These commands will be run from inside our MongoDB pod.

1. Exec into mongo database pod and export data
	```
	# list pods in the cluster and set the variable to your pod name
	kubectl get pod
	NAME                                                              READY     STATUS    RESTARTS   AGE
	heroes-api-deploy-1140957751-v2pqc                                1/1       Running   0          20h
	heroes-db-deploy-2357291595-xb4xm                                 1/1       Running   0          20h
	heroes-web-3683626428-9m8wp                                       1/1       Running   0          20h

	MONGO_POD=heroes-db-deploy-2357291595-xb4xm

	kubectl exec -it $MONGO_POD bash

	root@heroes-db-deploy-2357291595-xb4xm:/# mongodump
	```

2. Import the data using ```mongorestore```
	
	From the same prompt inside the pod, set the variables below and run the command.

	```
	# fill in values here:
	DBNAME=
	USER_NAME=
	COSMOS_URL=
	PASSWORD=

	mongorestore --host $COSMOS_URL:10255 -u $USER_NAME -p $PASSWORD --db $DBNAME --ssl --sslAllowInvalidCertificates /dump/webratings
	```
3. Exit from pod by typing `exit`

### View data the Azure Portal

When you navigate to your CosmosDB instance in the Azure portal, you can view your Database, Collections and Documents by navigating to the "Data Explorer" section of your CosmosDB instance.  You can perform CRUD, Query and other operations on your database here as well.

![Cosmos Data Explorer](img/cosmos_data_explorer.png "Cosmos Data Explorer")

## Update the Heroes App to use CosmosDB

### Setup CosmosDB Connection String

In this section we will learn how to retrieve the CosmosDB connection string that is required in order to connect to your new database in Azure.  The connection string takes the format: ```mongodb://<username>:<password>@<cosmosdb-url>:10255/<dbname>?ssl=true```.  The connection string is broken down into three important parts:

- ```<username>```: The username to connect to your instance, this is the same value as the name of your database
- ```<password>```: This is one of two auto generated 88 character hashed passwords provided for you.  You can regenerate/revoke a password when you need to.
- ```<cosmos-url>```: This is the CosmosDB url where your instance can be reached.  Typically it should follow the format ```<your-cosmosdb-name>.documents.azure.com
- ```<dbname>```: This is the name of the collection in CosmosDB where all of the data is stored.

Note:
- Port number (```10255```) - CosmosDB does not use the standard MongoDB port of ```21017```
- SSL - this is on by default and is recommended when communicating to CosmosDB.  This is good practice and ensures your data is not sent in clear unencrypted text over the network.

Set these as environment variables for later use. You can retrieve the values using the Azure Portal or the CLI. 

```
# update the lines below with your config details
DBNAME=
USER_NAME=
PASSWORD=
COSMOS_URL=

CONNECT_STRING=mongodb://$USER_NAME:$PASSWORD@$COSMOS_URL:10255/$DBNAME?ssl=true

echo $CONNECT_STRING
mongodb://userid:longpassword@cosmosacct.documents.azure.com:10255/dbname?ssl=true

# make note of this. you will use this value in the next step
```

### Update the API deployment to use the new CosmosDB connect string

1. Edit the `heroes-web-api.yaml` file in `helper-files`
	The snippet below is the section that must be udpated. We are replacing the `MONGODB_URI` value with the new connect string created in the prior section
	```
	env:
	- name:  MONGODB_URI
		value: mongodb://userid:longpassword@cosmosacct.documents.azure.com:10255/dbname?ssl=true
	ports:
	- containerPort:  3000
		name:  heroes-api
	imagePullPolicy: Always
	restartPolicy: Always
	```

2. Apply the new config in AKS
	```
	kubectl apply -f heroes-web-api.yaml
	```

## Browse to the heroes web app and test the result

## Delete the MongoDB pod

Just for the fun of it, delete your MongoDB pod and ensure your app is now fully migrated to a PaaS-based data layer. 

```
kubectl get deploy

NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
heroes-api-deploy   1         1         1            1           10m
heroes-db-deploy    1         1         1            1           30m
heroes-web          1         1         1            1           10m

kubectl delete -f heroes-db.yaml
```
