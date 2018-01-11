# Moving your data services to Hosted Data Solutions (CosmosDB)

In this section we will be creating a CosmosDB instance in your Azure account to migrate/export your MongoDB data to CosmosDB.  You can use CosmosDB as a drop in replacement for MongoDB, since CosmosDB uses a MongoDB compatibale API.  As such, you are only required to replace/change the MongoDB URI connection string with one supplied by CosmosDB in the dashboard. 

## 00 - Setup

You will need to prepare and setup your environment in order to move data from your MongoDB Server to CosmosDB.

### Creating a CosmosDB Service/Instance

You can create a CosmosDB service/instance in one (1) of two (2) ways:
1. Via the cross-platform [Azure-CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest) command line tool --**or**--
2. Via the Azure Web Portal

#### Method 1: via Azure-CLI

The Azure-CLI Command Line Tool is available and supported for Windows, macOS and Linux. The following uses the cross plaform Azure-CLI in a Linux bash shell to deploy an instance of CosmosDB into your Azure Subscription/Account.

```
# Set variables for the new account, database, and collection
resourceGroupName='someResourceGroupName'
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

#### Method 2: via Azure Web Portal


## 01 - Connecting to CosmosDB

In this section we will learn how to retrieve the CosmosDB connection string that is required in order to connect to your new database in Azure.  The connection string takes the format: ```mongodb://<username>:<password>@<cosmosdb-url>:10255/?ssl=true```.  The connection string is broken down into three important parts:

- ```<username>```: The username to connect to your instance, this is the same value as the name of your database
- ```<password>```: This is one of two auto generated 88 character hashed passwords provided for you.  You can regenerate/revoke a password when you need to.
- ```<cosmos-url>```: This is the CosmosDB url where your instance can be reached.  Typically it should follow the format ```<your-cosmosdb-name>.documents.azure.com

Note:
- Port number (```10255```) - CosmosDB does not use the standard MongoDB port of ```21017```
- SSL - this is on by default and is recommended when communicating to CosmosDB.  This is good practice and ensures your data is not sent in clear unencrypted text over the network.

### Method 1: via Azure-CLI

The simplest/quickest method for retrieving your CosmosDB Connection string is via the command line.  If you have the Azure-CLI installed you can simply run the following command, replacing ```<resource-group-name>``` and ```<cosmos-db-name>``` with the corresponding values for your CosmosDB instance.

```:bash
# !!!REPLACE <resource-group-name> and <cosmos-db-name> with your databases respective information!!!

az cosmosdb list-connection-strings -g <resource-group-name> -n <cosmos-db-name>
```

## 02 - Migrating Data From Mongo to CosmosDB

1. Export your MongoDB to a json file