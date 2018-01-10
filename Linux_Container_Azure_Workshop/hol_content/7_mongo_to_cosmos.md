# Moving your data services to Hosted Data Solutions (CosmosDB)

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
location1='northcentralus'
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


## 01 - 