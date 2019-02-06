# Kubernetes Dashboard

The Kubernetes dashboard is a web ui that lets you view, monitor, and troubleshoot Kubernetes resources. 

> Note: The Kubernetes dashboard is a secured endpoint and can only be accessed using the SSH keys for the cluster. Since cloud shell runs in the browser, it is not possible to tunnel to the dashboard using the steps below.

### Accessing The Dashboard UI

There are multiple ways of accessing Kubernetes dashboard. You can access through kubectl command-line interface or through the master server API. We'll be using `az aks browse` command, as it provides a secure connection, that doesn't expose the UI to the internet.

#### ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) Commands in this lab exercise needs to be run from a PowerShell session in your Local Computer ([azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest) requires to be installed in the Local Computer).

1. Command-Line Proxy
   
   From your local computer, open a local Powershell with elevated privileges
   
   Authenticate with Azure (if not already logged in)
   ```bash
   az login
   ``` 
   
   Download the AKS kubectl client tools
   
   ```bash
   az aks install-cli
   ```
   
    In case the `kubectl` command is still not available, you might have to add it to your $PATH variable.
    
    ```bash
    $env:path += ";$home\.azure-kubectl"
    ```
    
    Now lookup the resource group containing your cluster
    ```bash
    az group list --output table
    ```
    
    Lookup the name of your AKS cluster
    ```bash
    az aks list --output table
    ```
    
    And download your AKS credentials to connect `kubectl` to your Cluster
    
    ```bash
    az aks get-credentials --name <CLUSTER_NAME> --resource-group <RGNAME>
    ``` 
    
    And run `az aks browse` to create a local proxy running on `127.0.0.1:8001`
    ```bash
    az aks browse --name <CLUSTER_NAME> --resource-group <RGNAME>
    ```

    Now you can open a web browser (e.g. Firefox) and point to: `http://127.0.0.1:8001/`

    > By default, the Kubernetes dashboard is deployed with minimal read access and displays RBAC access errors.
    
    In case you're facing any "permission" errors in your dashboard, a ClusterRoleBinding must be created first:

    ```bash
    kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard
    ```

    > The Kubernetes dashboard does not currently support user-provided credentials to determine the level of access, rather it uses the roles granted to the service account. A cluster administrator can choose to grant additional access to the kubernetes-dashboard service account, however this can be a vector for privilege escalation.

### Explore Kubernetes Dashboard

1. In the Kubernetes Dashboard select nodes to view
![](img/ui_nodes.png)
2. Explore the different node properties available through the dashboard
3. Explore the different pod properties available through the dashboard ![](img/ui_pods.png)
4. In this lab, feel free to take a look around other resources Kubernetes provides through the dashboard.

> To learn more about Kubernetes objects and resources, browse the documentation: <https://kubernetes.io/docs/user-journeys/users/application-developer/foundational/#section-3>


   ##### [Return back to BootCamp Table of Contents (Main Page)](/README.md)
