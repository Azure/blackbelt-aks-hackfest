# Virtual-Kubelet and Azure Container Instances

Virtual Kubelet is an open source Kubernetes kubelet implementation that masquerades as a kubelet for the purposes of connecting Kubernetes to other APIs. This allows the nodes to be backed by other services like ACI, Hyper.sh, AWS, etc. This connector features a pluggable architecture and direct use of Kubernetes primitives, making it much easier to build on.

## How It Works

The diagram below illustrates how Virtual-Kubelet works.

![diagram](img/VK-ACI.png)

## Prerequisities

To [use Virtual Kubelet with AKS](https://docs.microsoft.com/en-us/azure/aks/virtual-kubelet) you will need:
- Azure CLI version 2.0.33 or later
- Helm installed, [if not checkout Lab 6](https://github.com/mathieu-benoit/blackbelt-aks-hackfest/blob/k8s-1-10-6/labs/day1-labs/06-monitoring-k8s.md#install-helm)

### Create a Resource Group for ACI

To use Azure Container Instances, you must provide a resource group. We will use the existing Resource Group you were assigned.

```console
az group list
```
Output:
```
[
    {
        "id": "/subscriptions/b23accae-e655-44e6-a08d-85fb5f1bb854/resourceGroups/ODL-aks-v2-gbb-8386",
        "location": "centralus",
        "managedBy": null,
        "name": "ODL-aks-v2-gbb-8386",
        "properties": {
        "provisioningState": "Succeeded"
        },
        "tags": {
        "AttendeeId": "8391",
        "LaunchId": "486",
        "LaunchType": "ODL",
        "TemplateId": "1153"
        }
    }
    ]
```

Copy the name from the results above and set to a variable:
```
export AZURE_RG=<name>
```

## Deployment of the ACI provider in your cluster

Grab the name of your AKS cluster and assign it to the variable below:
```
export AKS_CLUSTER_NAME=<name>
```

Install the Virtual-Kubelet connector in your AKS cluster to EastUS:

```
az aks install-connector --resource-group $AZURE_RG --name $AKS_CLUSTER_NAME --connector-name virtual-kubelet --os-type Linux --location eastus
```

Output:

```console
Deploying the ACI connector for 'Linux' using Helm
NAME:   virtual-kubelet-linux-eastus
LAST DEPLOYED: Sun Aug 19 01:04:36 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/ServiceAccount
NAME                                                  SECRETS  AGE
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks  1        27s

==> v1beta1/ClusterRoleBinding
NAME                                                  AGE
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks  24s

==> v1beta1/Deployment
NAME                                                  DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks  1        1        1           1          21s

==> v1/Pod(related)
NAME                                                             READY  STATUS   RESTARTS  AGE
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks-84fb8ltzbv  1/1    Running  0         20s

==> v1/Secret
NAME                                                  TYPE    DATA  AGE
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks  Opaque  3     30s


NOTES:
The virtual kubelet is getting deployed on your cluster.

To verify that virtual kubelet has started, run:

  kubectl --namespace=default get pods -l "app=virtual-kubelet-linux-eastus-virtual-kubelet-for-aks"

Note:
TLS key pair not provided for VK HTTP listener. A key pair was generated for you. This generated key pair is not suitable for production use.
```

Deploy another Virtual-Kubelet Connector in your AKS cluster to WestUS:
```
az aks install-connector --resource-group $AZURE_RG --name $AKS_CLUSTER_NAME --connector-name virtual-kubelet --os-type Linux --location westus
```

Output:

```console
Deploying the ACI connector for 'Linux' using Helm
NAME:   virtual-kubelet-linux-westus
LAST DEPLOYED: Sun Aug 19 01:44:23 2018
NAMESPACE: default
STATUS: DEPLOYED

RESOURCES:
==> v1/Secret
NAME                                                  TYPE    DATA  AGE
virtual-kubelet-linux-westus-virtual-kubelet-for-aks  Opaque  3     30s

==> v1/ServiceAccount
NAME                                                  SECRETS  AGE
virtual-kubelet-linux-westus-virtual-kubelet-for-aks  1        27s

==> v1beta1/ClusterRoleBinding
NAME                                                  AGE
virtual-kubelet-linux-westus-virtual-kubelet-for-aks  24s

==> v1beta1/Deployment
NAME                                                  DESIRED  CURRENT  UP-TO-DATE  AVAILABLE  AGE
virtual-kubelet-linux-westus-virtual-kubelet-for-aks  1        1        1           1          21s

==> v1/Pod(related)
NAME                                                             READY  STATUS   RESTARTS  AGE
virtual-kubelet-linux-westus-virtual-kubelet-for-aks-798c5bgxdq  1/1    Running  0         21s


NOTES:
The virtual kubelet is getting deployed on your cluster.

To verify that virtual kubelet has started, run:

  kubectl --namespace=default get pods -l "app=virtual-kubelet-linux-westus-virtual-kubelet-for-aks"

Note:
TLS key pair not provided for VK HTTP listener. A key pair was generated for you. This generated key pair is not suitable for production use.
```

## Validate the Virtual Kubelet ACI provider

To validate that the Virtual Kubelet has been installed, return a list of Kubernetes nodes using the [kubectl get nodes][kubectl-get] command. You should see a node that matches the name given to the ACI connector.

```azurecli-interactive
kubectl get nodes
```

Output:

```console
NAME                                           STATUS    ROLES     AGE       VERSION
aks-nodepool1-24399631-0                       Ready     agent     3d        v1.11.1
aks-nodepool1-24399631-1                       Ready     agent     3d        v1.11.1
virtual-kubelet-virtual-kubelet-linux-eastus   Ready     agent     20m       v1.8.3
virtual-kubelet-virtual-kubelet-linux-westus   Ready     agent     3m        v1.8.3
```

## Schedule a pod in ACI

We will use a nodeName constraint to force the scheduler to schedule the pod to the new `virtual-kubelet-virtual-kubelet-linux-eastus` node. The yaml file is included in `~/blackbelt-aks-hackfest/labs/helper-files/east-aci-heroes.yaml`. Edit the file to point to your Azure Container Registry, edit the dnsnamelabel to add your lab number and have your CosmosDB MongoDb connection String:

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: heroes-east
  labels:
    name:  heroes-east
  annotations:
    virtualkubelet.io/dnsnamelabel: "heroes-xxxxxx"
spec:
  imagePullSecrets:
    - name: acr-secret
  containers:
  - image: <login_server>.azurecr.io/azureworkshop/rating-web:v1
    imagePullPolicy: Always
    name: ratings-web
    resources:
      requests:
        memory: 1G
        cpu: 1
    env:
    - name:  API
      value:  http://localhost:3000/
    - name: KUBE_NODE_NAME
      value: "East US"
    ports:
    - containerPort: 8080
      name: http-web
      protocol: TCP
  - image: <login_server>.azurecr.io/azureworkshop/rating-api:v1
    imagePullPolicy: Always
    name: ratings-api
    resources:
      requests:
        memory: 1G
        cpu: 1
    env:
    - name:  MONGODB_URI
      value:  <value from lab#8>
    ports:
    - containerPort: 3000
      name: http-api
      protocol: TCP
  dnsPolicy: ClusterFirst
  nodeName: virtual-kubelet-virtual-kubelet-linux-eastus
  ```

  ```console
  cd ~/blackbelt-aks-hackfest/labs/helper-files
  kubectl apply -f east-aci-heroes.yaml 
  ```

Then deploy another pod to the new `virtual-kubelet-virtual-kubelet-linux-westus` node. The yaml file is included in `~/blackbelt-aks-hackfest/labs/helper-files/west-aci-heroes.yaml`. Edit the file to point to your Azure Container Registry, edit the dnsnamelabel to add your lab number and have your CosmosDB MongoDb connection String:

  ```yaml
apiVersion: v1
kind: Pod
metadata:
  name: heroes-west
  labels:
    name:  heroes-west
  annotations:
    virtualkubelet.io/dnsnamelabel: "heroes-xxxxx"
spec:
  imagePullSecrets:
    - name: acr-secret
  containers:
  - image: <login_server>.azurecr.io/azureworkshop/rating-web:v1
    imagePullPolicy: Always
    name: ratings-web
    resources:
      requests:
        memory: 1G
        cpu: 1
    env:
    - name:  API
      value:  http://localhost:3000/
    - name: KUBE_NODE_NAME
      value: "West US"
    ports:
    - containerPort: 8080
      name: http-web
      protocol: TCP
  - image: <login_server>.azurecr.io/azureworkshop/rating-api:v1
    imagePullPolicy: Always
    name: ratings-api
    resources:
      requests:
        memory: 1G
        cpu: 1
    env:
    - name:  MONGODB_URI
      value:  <value from lab#8>
    ports:
    - containerPort: 3000
      name: http-api
      protocol: TCP
  dnsPolicy: ClusterFirst
  nodeName: virtual-kubelet-virtual-kubelet-linux-westus
```

```console
kubectl apply -f west-aci-heroes.yaml
```
You could get the details about your Pods just deployed by running the command below (status of the Pods, on which node they are running, etc.):
```
kubectl get pods -o wide
```

```output
NAME                                                              READY     STATUS    RESTARTS   AGE       IP             NODE
heroes-east                                                       2/2       Running   0          1h        40.76.213.23   virtual-kubelet-virtual-kubelet-linux-eastus
virtual-kubelet-linux-eastus-virtual-kubelet-for-aks-84fb8ltzbv   1/1       Running   0          14h       10.244.1.41    aks-nodepool1-24399631-1
virtual-kubelet-linux-westus-virtual-kubelet-for-aks-798c5bgxdq   1/1       Running   0          13h       10.244.1.42    aks-nodepool1-24399631-1
```

# Set up Azure Traffic Manager Policies to Load Balance between ACI Instances

## Determine the FQDN of the ACI Instances

By placing the annotation for a DNSlabel ACI will receive an Azure assigned FQDN. The pattern that ACi uses is the Kubernetes dnsLabelName.azureregion.azurecontainer.io To determine the FQDN of your ACi instance run the following commands:

```console
az container show -g $AZURE_RG -n default-heroes-east --query ipAddress.fqdn
az container show -g $AZURE_RG -n default-heroes-west --query ipAddress.fqdn
```

The instances should have the FQDN of:

```output
heroes-14787.eastus.azurecontainer.io
heroes-14787.westus.azurecontainer.io
```

# Create a Traffic Manager profile in the Azure Portal

Microsoft Azure Traffic Manager allows you to control the distribution of user traffic for service endpoints in different datacenters. Service endpoints supported by Traffic Manager include Azure VMs, Web Apps, and cloud services. You can also use Traffic Manager with external, non-Azure endpoints.

Traffic Manager uses the Domain Name System (DNS) to direct client requests to the most appropriate endpoint based on a traffic-routing method and the health of the endpoints. Traffic Manager provides a range of traffic-routing methods and endpoint monitoring options to suit different application needs and automatic failover models. Traffic Manager is resilient to failure, including the failure of an entire Azure region.

## Create the Traffic Manager Profile

1. Create a Traffic Manager profile giving the main FQDN a unique label such as heroes-<your_lab_number>:

```console
az network traffic-manager profile create --name vk-aci-aks-tm --resource-group $AZURE_RG --routing-method Performance --unique-dns-name heroes-xxxxxx --monitor-port 8080
```

2. Now create an endpoint for both the east and west ACI instances, using their DNS FQDN you discovered in the previous exercise

```console
az network traffic-manager endpoint create --name heroes-east --resource-group $AZURE_RG --profile-name vk-aci-aks-tm --type externalEndpoints --endpoint-location eastus --endpoint-status enabled --target heroes-177502.eastus.azurecontainer.io

az network traffic-manager endpoint create --name heroes-west --resource-group $AZURE_RG --profile-name vk-aci-aks-tm --type externalEndpoints --endpoint-location westus --endpoint-status enabled --target heroes-177502.westus.azurecontainer.io
```

3. Verify that the endpoint monitor status has become online:
```console
az network traffic-manager endpoint show --name heroes-east --resource-group $AZURE_RG --profile-name vk-aci-aks-tm --type externalEndpoints -o table

az network traffic-manager endpoint show --name heroes-west --resource-group $AZURE_RG --profile-name vk-aci-aks-tm --type externalEndpoints -o table
```

The output should be similar to the below:
```output
EndpointLocation    EndpointMonitorStatus    EndpointStatus    Name           Priority  ResourceGroup    Target                             Weight
------------------  -----------------------  ----------------  -----------  ----------  ---------------  -------------------------------  --------
East US             Online                   Enabled           heroes-east           1  vk-aci-aks-tm       heroes.eastus.azurecontainer.io         1
```

4. Now test in your browser using the url http://heroes-xxxxxx.trafficmanager.net:8080 and the Super Heroes voting page should load. In the footer of the page it will either say East US or West US based upon performance routing using Traffic Manager.
