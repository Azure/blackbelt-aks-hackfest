#!/bin/bash

# Set variables for the new MongoDB API account and database
resourceGroupName=${1?You must pass resource group name as argument}
location='eastus'
accountName='heroscosmosaccount'
databaseName='heroratings'

# Create a resource group
az group create \
    --name $resourceGroupName \
    --location $location


# Create a MongoDB API Cosmos DB account with consistent prefix (Local) consistency
az cosmosdb create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --kind MongoDB \
    --default-consistency-level "ConsistentPrefix" \
    --enable-multiple-write-locations false

# Create a database 
az cosmosdb database create \
    --resource-group $resourceGroupName \
    --name $accountName \
    --db-name $databaseName

# Enable aggregation pipeline in CosmosDB (preview feature)
az cosmosdb update -n $accountName -g $resourceGroupName --capabilities EnableAggregationPipeline

# Get the cosmos secret
cosmosSecret=$(az cosmosdb list-keys -n $accountName -g $resourceGroupName --query "primaryMasterKey" -o tsv)

# Create Mongo URI for CosmosDB webratings db
cosmosUri="mongodb://$accountName:$cosmosSecret@$accountName.documents.azure.com:10255/webratings?ssl=true"

# Create the Kubernetes secret
kubectl create secret generic heroes-cosmosdb-secret --from-literal=cosmosUri=$cosmosUri

# Deploy db initialization, web, api and service to AKS:
kubectl apply -f ./init-web-api-sample.yaml

# Steps to run containers locally for testing here: https://github.com/ms-jasondel/blackbelt-aks-hackfest/blob/demo/labs/day1-labs/02-dockerize-apps.md
