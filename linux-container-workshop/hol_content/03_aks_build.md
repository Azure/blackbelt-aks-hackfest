# Azure Kubernetes Service Deployment

## Create AKS cluster through Azure CLI

1. Open your terminal and login to your Azure subscription using the az cli
    ```
    az login
    ```
    
2. Verify your subscription is correctly selected as the default
    ```
    az account list
    ```

3. Create an empty resource Group for your AKS Resource
    
    You will need to create a unique name for your RG and AKS cluster. The first couple commands will store this in a variable called `NAME` that will be used throughout.
    
    ```
    UUID=$(uuidgen)
    NAME="HEROES"-${UUID:0:8}
    
    # create the RG
    az group create -n $NAME-aks-rg -l centralus
    ```

4. Create your AKS cluster in the empty resource group created above with 2 nodes, targeting Kubernetes version 1.7.7
    ```
    az aks create -n $NAME-aks-c1 -g $NAME-aks-rg -c 2 -k 1.7.7
    ```

5. Get the Kubernetes config files for your new AKS cluster
    ```
    az aks get-credentials -n $NAME-aks-c1 -g $NAME-aks-rg
    ```

6. Verify you have API access to your new AKS cluster
    ```
    kubectl get nodes
    ```

You should now have a Kubernetes cluster running with 2 nodes. You do not see the master servers for the cluster because these are managed by Microsoft. The Control Plane services which manage the Kubernetes cluster such as scheduling, API access, configuration data store and object controllers are all provided as services to the nodes. 