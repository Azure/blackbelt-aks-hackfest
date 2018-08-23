# Kubernetes Dashboard

The Kubernetes dashboard is a web ui that lets you view, monitor, and troubleshoot Kubernetes resources. 

> Note: The Kubernetes dashboard is a secured endpoint and can only be accessed using the SSH keys for the cluster. Since cloud shell runs in the browser, it is not possible to tunnel to the dashboard using the steps below.

### Accessing The Dashboard UI

There are multiple ways of accessing Kubernetes dashboard. You can access it through the `kubectl` or `az` command-line interface or directly through the master server API. We'll be using ```az aks browse``` as it simplifies the process of creating a secure local proxied connection to the API Server and doesn't expose the UI to the internet.

1. Command-Line using the Azure CLI

    * Open an RDP session to the jumpbox IP with username and password
    * Run ```az login``` to authenticate with Azure in order to use Azure CLI in the Jumpbox instead of Cloud Shell
    * Run ```NAME=$(az group list -o table | grep ODL | awk '{print $1}')``` in order to retrieve the name of the resource group for your Azure account and put it in the NAME variable.
    * Run ```CLUSTER_NAME="${NAME//_}"``` in order to retrieve the cluster name (to remove the underscore)
    * Run ```az aks browse -n $CLUSTER_NAME -g $NAME``` to open the Kubernetes Dashboard UI in a web browser (Firefox is pre-installed on the Jumpbox)

### Explore Kubernetes Dashboard

1. In the Kubernetes Dashboard select nodes to view
![](img/ui_nodes.png)
2. Explore the different node properties available through the dashboard
3. Explore the different pod properties available through the dashboard ![](img/ui_pods.png)
4. In this lab feel free to take a look around other at  other resources Kubernetes provides through the dashboard

> To learn more about Kubernetes objects and resources, browse the documentation: <https://kubernetes.io/docs/user-journeys/users/application-developer/foundational/#section-3>
