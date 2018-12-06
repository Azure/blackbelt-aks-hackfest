# Azure Kubernetes Service (AKS) Deployment
## Create AKS cluster

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform these steps in the Jumpbox**

1. In the ssh session login to the Azure subscription
    ```
    az login
    ```
2. Select the subscription where you want to create the AKS cluster
   ```
   az account set --subscription xxxx-925a-440b-84b1-xxxxxxx
   ```
3. Verify your subscription is correctly selected as the default
    ```
    az account list
    ```

4. Create a new resource group (eg: myaksrg)
    ```
    az group create --name myaksrg --location eastus
    ```

5. Find your RG name

    ```
    az group list 
    ```
    
    ```

    [
    {
      "id": "/subscriptions/c45eeda7-1811-4ab1-8fe2-efdd99c9d489/resourceGroups/myaksrg",
      "location": "eastus",
      "managedBy": null,
      "name": "myaksrg",
      "properties": {
        "provisioningState": "Succeeded"
      },
      "tags": null
    }
    ]
    ```
    
    ```
    # copy the name from the results above and set to a variable 
    
    NAME=

    # We need to use a different cluster name, as sometimes the name in the group list has an underscore, and only dashes are permitted
    
    CLUSTER_NAME="${NAME//_}"
    
    ```

6. Create your AKS cluster in the resource group created above with 2 nodes, targeting Kubernetes version 1.10.8
    ```
    # set the location to one of the provided AKS locations (eg - centralus, eastus)
    
    LOCATION=eastus

    az aks create --name $CLUSTER_NAME --resource-group $NAME --node-count 2 \
                  --kubernetes-version 1.10.8 --generate-ssh-keys --location $LOCATION 
    ```
 This command can take 5-25 minutes to run as it is creating the AKS cluster. Please be PATIENT...

9. Verify your cluster status. The `ProvisioningState` should be `Succeeded`. 

    ```bash
    az aks list --output table
    ```
    
    ```console
    Name      Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
    --------  ----------  ---------------  -------------------  -------------------  ---------------------------------------------------    ---
    myaksrg   eastus      myaksrg          1.10.8                Succeeded            myaksrg-myaksrg-9a4f9a-7a0ba239.hcp.eastus.azmk8s.io

    ```

The `output` parameter is used display the output as a table to increase readability.

10. Get the Kubernetes config files for your new AKS cluster. This is necessary to use `kubectl` to manage your Kubernetes cluster.

    ```bash
    az aks get-credentials --name $CLUSTER_NAME --resource-group $NAME
    ```

11. Verify you have API access to your new AKS cluster

    > Note: It can take 5 minutes for your nodes to appear and be in READY state. You can run `kubectl get nodes --watch` to monitor status. 
    
    ```bash
    kubectl get nodes
    ```
    
    ```console
    NAME                       STATUS    ROLES     AGE       VERSION
    aks-nodepool1-26044360-0   Ready     agent     4m        v1.10.8
    aks-nodepool1-26044360-1   Ready     agent     4m        v1.10.8

    ```
    
    To see the default pods which are part of your AKS cluster, run the following command:
    ```
     kubectl get pods -n kube-system
    ```
    
    To see more details about your cluster: 
    
    ```bash
    kubectl cluster-info
    ```
    
    ```console    
    Kubernetes master is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443
    Heapster is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/heapster/proxy
    KubeDNS is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    kubernetes-dashboard is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

You should now have a Kubernetes cluster running with 2 nodes. You do not see the master servers for the cluster because these are managed by Microsoft. The Control Plane services which manage the Kubernetes cluster such as scheduling, API access, configuration data store and object controllers are all provided as services to the nodes. 

In the Azure portal, you will see the AKS cluster present under the Resourcegroup that you have mentioned in the previous commands. 

You will also see an additional Resource Group with a naming convention `MC_<ResourceGroup>_<ClusterName>_<Location>` in the Azure portal. This is a new Resource Group that gets created automatically which contains all the infrastructure components of your AKS cluster. 
