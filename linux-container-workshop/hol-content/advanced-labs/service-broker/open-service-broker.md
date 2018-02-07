# Open Service Broker for Azure (OSBA)

In this lab, we will deploy the Open Service Broker for Azure and the Kubernetes Service Catalog to automate the delivery of CosmosDB and configuration of our application.

## Install the Azure Service Broker on AKS

1. Ensure helm is working. In prior labs, we used helm to install charts. Check to see if it is working

```
odl_user@Azure:~$ helm version
Client: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
Server: &version.Version{SemVer:"v2.8.0", GitCommit:"14af25f1de6832228539259b821949d20069a222", GitTreeState:"clean"}
```

2. Install Service Catalog on AKS

```
helm repo add svc-cat https://svc-catalog-charts.storage.googleapis.com

helm install svc-cat/catalog --name catalog --namespace catalog --set rbacEnable=false
```

3. Gather config details for subscription and service principal

If you are using the Workshop Classroom experience, these values will be emailed to you.

```
# set the below to values for your sub
export AZURE_SUBSCRIPTION_ID=
export AZURE_TENANT_ID=
export AZURE_CLIENT_ID=
export AZURE_CLIENT_SECRET=
```

4. Deploy the Service Broker chart

```
helm repo add azure https://kubernetescharts.blob.core.windows.net/azure

helm install azure/open-service-broker-azure --name osba --namespace osba \
  --set azure.subscriptionId=$AZURE_SUBSCRIPTION_ID \
  --set azure.tenantId=$AZURE_TENANT_ID \
  --set azure.clientId=$AZURE_CLIENT_ID \
  --set azure.clientSecret=$AZURE_CLIENT_SECRET
```

> This may take a few minutes to start running. We must wait for redis to start. Got get some coffee. 

5. Check to see if components are running

```
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

1. Review the `heroes-cosmosdb.yaml` file

* Along with the web and api configs, you will see a `ServiceInstance` object and a `ServiceBinding` object. 
* You will also see a secret defined in the API deployment that sets the `MONGODB_URI` environment variable.

2. Deploy the application

```
kubectl apply -f heroes-cosmosdb.yaml
```

3. Review the resulting objects

```
kubectl get pod,secret,serviceinstance,servicebinding



```

4. Validate the CosmosDB instance has been created in the resource group `heroes-cosmosdb`


