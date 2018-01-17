# Azure Kubernetes Service (AKS) Deployment

## Create AKS cluster through Azure CLI

1. Open your terminal and login to your Azure subscription using the az cli
    ```
    az login
    ```
    
2. Verify your subscription is correctly selected as the default
    ```
    az account list
    ```
3. Find your RG name

    ```
    az group list

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

    # grab the name from the results above and set to a variable 
    NAME=ODL-aks-v2-gbb-8386
    
    ```

3. Create your AKS cluster in the resource group created above with 2 nodes, targeting Kubernetes version 1.7.7
    ```
    az aks create -n $NAME -g $NAME -c 2 -k 1.7.7 --generate-ssh-keys
    ```

5. Get the Kubernetes config files for your new AKS cluster
    ```
    az aks get-credentials -n $NAME -g $NAME
    ```

6. Verify you have API access to your new AKS cluster
    ```
    kubectl get nodes
    ```

You should now have a Kubernetes cluster running with 2 nodes. You do not see the master servers for the cluster because these are managed by Microsoft. The Control Plane services which manage the Kubernetes cluster such as scheduling, API access, configuration data store and object controllers are all provided as services to the nodes. 