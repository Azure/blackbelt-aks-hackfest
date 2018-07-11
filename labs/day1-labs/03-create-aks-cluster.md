# Azure Kubernetes Service (AKS) Deployment

## Create AKS cluster

1. Login to Azure Portal at http://portal.azure.com. 
2. Open the Azure Cloud Shell

    ![Azure Cloud Shell](img/cloudshell.png "Azure Cloud Shell")

3. The first time Cloud Shell is started will require you to create a storage account. In our lab, you must click `Advanced` and enter an account name and share.

4. Once your cloud shell is started, clone the workshop repo into the cloud shell environment
    ```
    git clone https://github.com/Azure/blackbelt-aks-hackfest.git
    ```

5. In the cloud shell, you are automatically logged into your Azure subscription. ```az login``` is not required.
    
6. Verify your subscription is correctly selected as the default
    ```
    az account list
    ```

7. Create a new resource group (rg)
    ```
    az group create --name myaksrg --location eastus
    ```

7. Find your RG name

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

    # copy the name from the results above and set to a variable 
    
    NAME=

    # We need to use a different cluster name, as sometimes the name in the group list has an underscore, and only dashes are permitted
    
    CLUSTER_NAME="${NAME//_}"
    
    ```

8. Create your AKS cluster in the resource group created above with 2 nodes, targeting Kubernetes version 1.9.6
    ```
    # This command can take 5-25 minutes to run as it is creating the AKS cluster. Please be PATIENT...
    
    # set the location to one of the provided AKS locations (eg - centralus, eastus)
    
    LOCATION=eastus

    az aks create -n $CLUSTER_NAME -g $NAME -c 2 -k 1.9.6 --generate-ssh-keys -l $LOCATION
    ```

9. Verify your cluster status. The `ProvisioningState` should be `Succeeded`
    ```
    az aks list -o table

    Name      Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
    --------  ----------  ---------------  -------------------  -------------------  ---------------------------------------------------    ---
    myaksrg   eastus      myaksrg          1.9.6                Succeeded            myaksrg-myaksrg-9a4f9a-7a0ba239.hcp.eastus.azmk8s.io

    ```


10. Get the Kubernetes config files for your new AKS cluster. This is necessary to use `kubectl` to manage your Kubernetes cluster.
    ```
    az aks get-credentials -n $CLUSTER_NAME -g $NAME
    ```

11. Verify you have API access to your new AKS cluster

    > Note: It can take 5 minutes for your nodes to appear and be in READY state. You can run `watch kubectl get nodes` to monitor status. 
    
    ```
    kubectl get nodes
    
    NAME                       STATUS    ROLES     AGE       VERSION
    aks-nodepool1-26044360-0   Ready     agent     4m        v1.9.6
    aks-nodepool1-26044360-1   Ready     agent     4m        v1.9.6

    ```
    
    To see the default pods which are part of your AKS cluster, run the following command:
    ```
     kubectl get pods -n kube-system
    ```
    
    To see more details about your cluster: 
    
    ```
    kubectl cluster-info
    
    Kubernetes master is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443
    Heapster is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/heapster/proxy
    KubeDNS is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
    kubernetes-dashboard is running at https://myaksrg-myaksrg-9a4f9a-133097cc.hcp.eastus.azmk8s.io:443/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy

    To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
    ```

You should now have a Kubernetes cluster running with 2 nodes. You do not see the master servers for the cluster because these are managed by Microsoft. The Control Plane services which manage the Kubernetes cluster such as scheduling, API access, configuration data store and object controllers are all provided as services to the nodes. 
