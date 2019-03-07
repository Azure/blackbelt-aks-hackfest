# Open Service Broker for Azure (OSBA)

In this lab, we will deploy the Open Service Broker for Azure and the Kubernetes Service Catalog to automate the delivery of CosmosDB and configuration of our application. The heroes application requires a back-end Cosmos DB. 

In the earlier exercise, without OSBA, we had created a Cosmos DB account in the Azure portal, and then manually configured the connection information in the YAML file. Now with OSBA, our Kubernetes manifests can provision an Azure Cosmos DB account in Azure on our behalf, save the connection information in Kubernetes secrets, and then bind them to our API instance.

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform below steps in the Jumpbox**

## Install the Azure Service Broker on AKS

1. Ensure Helm 2.7+ is Installed and Working

* In prior labs, we used helm to install charts. Check to see if it is working and the version is 2.7 or above.

```bash
helm version
```
```output
Client: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
```

* If a newer version of Helm is required, click [here](https://docs.helm.sh/using_helm/#installing-helm) for instructions on installing and updating Helm.

2. Install Service Catalog on AKS

* This step will install the Kubernetes Service Catalog which is a pre-requisite for OSBA.

``` bash
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com

helm install svc-cat/catalog --name catalog --namespace catalog --set rbac.Enabled=true  --set apiserver.healthcheck.enabled=false    --set controllerManager.healthcheck.enabled=false
```

3. Create a new service principal 

``` bash
az ad sp create-for-rbac --name osba-sp -o table
```

4. Gather Config Details

* Gather the following Subscription and Service Principal details from the output of the previous command 

```bash
# set the below to values for your sub
# !Get ID using command "az account list | grep id"
export AZURE_SUBSCRIPTION_ID=<SubscriptionID>
export AZURE_TENANT_ID=<Tenant>
export AZURE_CLIENT_ID=<AppID>
export AZURE_CLIENT_SECRET=<Password>
```

5. Deploy the Service Broker Chart

* Now that all the pre-requisites have been setup and the configuration details gathered. We are now ready to install OSBA via the Helm Chart.

```bash
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure

helm install azure/open-service-broker-azure --name osba --namespace osba --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID --set azure.tenantId=$AZURE_TENANT_ID --set azure.clientId=$AZURE_CLIENT_ID --set azure.clientSecret=$AZURE_CLIENT_SECRET --version 0.11.0 --set modules.minStability=EXPERIMENTAL --set rbac.Enabled=true
```

> **This may take a few minutes to start running. We must wait for redis to start. Go get some coffee.**

6. Check Components

In this step we will check to see that the Service Catalog and OSBA components are up and running.

```bash
kubectl get pod -n catalog
```
```output
NAME                                                  READY     STATUS    RESTARTS   AGE
catalog-catalog-apiserver-1988923711-qg940            2/2       Running   0          1h
catalog-catalog-controller-manager-1758219338-hgw48   1/1       Running   0          1h
```
```bash
kubectl get pod -n osba
```
```output
NAME                                              READY     STATUS    RESTARTS   AGE
osba-open-service-broker-azure-1684006674-kflp2   1/1       Running   4          5m
osba-redis-3506537388-f6k17                       1/1       Running   0          5m
```

## Deploy App with CosmosDB instance

1. Clear Existing App Out of Cluster

* Remove the previous application out of your cluster by deleting your deployments to ensure the OSBA version is the only one and there are no conflicts.

2. Review the `heroes-cosmosdb.yaml` file in the `helper-files` directory

* Along with the web and api configs, you will see a `ServiceInstance` object and a `ServiceBinding` object. 
* You will also see a secret defined in the API deployment that sets the Mongo DB environment variables for connecting to the Cosmos DB Mongo DB API. While deployment a new Cosmos DB account gets created in a resource group called **heroes-cosmosdb** and sets the DB connection parameters as Kubernetes secret(**heroes-cosmosdb-secret**)

3. Deploy the Application using OSBA

* This step will provision the entire application with the Cosmos Mongo DB back-end in Azure via OSBA.

```bash
cd ~/container-bootcamp/labs/helper-files

kubectl apply -f heroes-cosmosdb.yaml
```


4. Review the Resulting Objects

* By looking at the following Kubernetes resources you will see all the different resources that make up the OSBA deployment.

```bash
kubectl get pod,serviceinstance,servicebinding

kubectl get secret
```
> **This may take a few minutes to start running. Wait till the Kubernetes secret(**heroes-cosmosdb-secret**) gets created. Go get some coffee.**

> **Note - If the heroes-api pod gets stuck at "CreateContainerConfigError" status, re-run "kubectl apply -f heroes-cosmosdb.yaml" and make sure the status changes to "Running" before proceeding with the next step.

> **Before proceeding to the next step ensure all of the resources are created and up and running.**

5. Enable Aggregation Pipelines in Cosmos DB

* A preview feature of Cosmos DB is being leveraged so it needs to be enabled. In the future this will be able to be done via OSBA.
* The first step is to log into the **az cli** via the Jumpbox and using your Azure Service Principal.
* Check to see that az cli version is 2.0.27 or greater.

```bash
az --version
```

* If the az cli is < 2.0.27 then update the cli. To update you can run `yum update azure-cli -y`

```bash
# Do this in Jumpbox and ensure az --version is 2.0.27 or greater
az login --service-principal -u $AZURE_CLIENT_ID -p $AZURE_CLIENT_SECRET --tenant $AZURE_TENANT_ID
```

* You are now logged in as the Service Principal, enable the Preview Feature

```bash
# Grab the name of the Cosmos DB Account.
az cosmosdb list -o table

COSMOS_DB_ACCOUNT_NAME=$(az cosmosdb list -o table --query '[].{name:name,resourceGroup:resourceGroup}' | grep "heroes-cosmosdb" | awk '{print $1}')

# Use the name value from above and substitute into {COSMOS_DB_ACCOUNT_NAME}.
# The Resource Group name comes from the K8S manifest file under ServiceInstance.
az cosmosdb update -n $COSMOS_DB_ACCOUNT_NAME -g heroes-cosmosdb --capabilities EnableAggregationPipeline
```

6. Validate the App Works

* Just like in the previous labs, find the **web** Kubernetes **svc** and use that Public IP address to hit the website in your browser.

```bash
kubectl get svc
```


   ##### [Return back to BootCamp Table of Contents (Main Page)](/README.md)