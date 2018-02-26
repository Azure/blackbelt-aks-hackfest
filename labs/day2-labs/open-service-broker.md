# Open Service Broker for Azure (OSBA)

In this lab, we will deploy the Open Service Broker for Azure and the Kubernetes Service Catalog to automate the delivery of CosmosDB and configuration of our application.

## Install the Azure Service Broker on AKS

1. Ensure Helm 2.7+ is Installed and Working

* In prior labs, we used helm to install charts. Check to see if it is working and the version is 2.7 or above.

```bash
odl_user@Azure:~$ helm version
Client: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
```

* If a newer version of Helm is required, click [here](https://docs.helm.sh/using_helm/#installing-helm) for instructions on installing and updating Helm.

2. Install Service Catalog on AKS

* This step will install the Kubernetes Service Catalog which is a pre-requisite for OSBA.

``` bash
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com

helm install svc-cat/catalog --name catalog --namespace catalog --set rbacEnable=false
```

3. Gather Config Details

* Gather the following Subscription and Service Principal details. If you are using the Workshop Classroom experience, these values will be on the Launch Lab screen and you should have also received an e-mail copy.

```bash
# set the below to values for your sub
export AZURE_SUBSCRIPTION_ID=
export AZURE_TENANT_ID=
export AZURE_CLIENT_ID=
export AZURE_CLIENT_SECRET=
```

4. Deploy the Service Broker Chart

* Now that all the pre-requisites have been setup and the configuration details gathered. We are now ready to install OSBA via the Helm Chart.

```bash
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure

helm install azure/open-service-broker-azure --name osba --namespace osba \
  --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID \
  --set azure.tenantId=$AZURE_TENANT_ID \
  --set azure.clientId=$AZURE_CLIENT_ID \
  --set azure.clientSecret=$AZURE_CLIENT_SECRET
```

> **This may take a few minutes to start running. We must wait for redis to start. Go get some coffee.**

5. Check Components

In this step we will check to see that the Service Catalog and OSBA components are up and running.

```bash
odl_user@Azure:~$ kubectl get pod -n catalog
NAME                                                  READY     STATUS    RESTARTS   AGE
catalog-catalog-apiserver-1988923711-qg940            2/2       Running   0          1h
catalog-catalog-controller-manager-1758219338-hgw48   1/1       Running   0          1h

odl_user@Azure:~$ kubectl get pod -n osba
NAME                                              READY     STATUS    RESTARTS   AGE
osba-open-service-broker-azure-1684006674-kflp2   1/1       Running   4          5m
osba-redis-3506537388-f6k17                       1/1       Running   0          5m
```

## Deploy App with CosmosDB instance

1. Clear Existing App Out of Cluster

* Remove the previous application out of your cluster by deleting your deployments to ensure the OSBA version is the only one and there are no conflicts.

2. Review the `heroes-cosmosdb.yaml` file in the `helper-files` directory

* Along with the web and api configs, you will see a `ServiceInstance` object and a `ServiceBinding` object. 
* You will also see a secret defined in the API deployment that sets the Mongo DB environment variables for connecting to the Cosmos DB Mongo DB API.

3. Deploy the Application using OSBA

* This step will provision the entire application with the Cosmos Mongo DB back-end done via OSBA.

```bash
cd ~/blackbelt-aks-hackfest/labs/helper-files

kubectl apply -f heroes-cosmosdb.yaml
```

4. Review the Resulting Objects

* By looking at the following Kubernetes resources you will see all the different resources that make up the OSBA deployment.

```bash
kubectl get pod,secret,serviceinstance,servicebinding
```

5. Validate the CosmosDB Instance has been Created in Azure

* Just like in the previous labs, find the **web** Kubernetes **svc** and use that Public IP address to hit the website in your browser.

```bash
kubectl get svc
```
