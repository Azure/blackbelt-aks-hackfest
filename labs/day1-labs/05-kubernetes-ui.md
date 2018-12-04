# Kubernetes Dashboard

The Kubernetes dashboard is a web ui that lets you view, monitor, and troubleshoot Kubernetes resources. 

> Note: The Kubernetes dashboard is a secured endpoint and can only be accessed using the SSH keys for the cluster. Since cloud shell runs in the browser, it is not possible to tunnel to the dashboard using the steps below.

### Accessing The Dashboard UI

There are multiple ways of accessing Kubernetes dashboard. You can access through kubectl command-line interface or through the master server API. We'll be using 'az aks browse' command, as it provides a secure connection, that doesn't expose the UI to the internet.

#### ![#f03c15](https://placehold.it/15/f03c15/000000?text=+) Commands in this lab exercise needs to be run from a PowerShell session in your Local Computer ([azure cli](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest) requires to be installed in the Local Computer). ####

1. Command-Line Proxy

    * From your local computer, open a local command prompt or Powershell with elevated privileges
    * Run ```az login``` to authenticate with Azure
    * Run ```az aks install-cli``` to download the AKS kubectl client tools
    * Run ```$env:path += ";$home\.azure-kubectl"``` to add the kubectl to your path
    * Run ```az group list -o table``` to lookup the resource group containing your cluster
    * Run ```az aks list -o table``` to lookup the name of your AKS cluster
    * Run ```az aks get-credentials -n CLUSTER_NAME -g RGNAME``` in order to get the credentials to access our managed Kubernetes cluster in Azure. Replace CLUSTER_NAME with your AKS Cluster name and RGNAME with the name of your resource group.
    * Run ```az aks browse -n CLUSTER_NAME -g RGNAME```
    * This creates a local proxy to 127.0.0.1:8001
    * Open a web browser (e.g. Firefox) and point to: <http://127.0.0.1:8001/>
    * If your AKS cluster uses RBAC, a ClusterRoleBinding must be created before you can correctly access the dashboard. By default, the Kubernetes dashboard is deployed with minimal read access and displays RBAC access errors. The Kubernetes dashboard does not currently support user-provided credentials to determine the level of access, rather it uses the roles granted to the service account. A cluster administrator can choose to grant additional access to the kubernetes-dashboard service account, however this can be a vector for privilege escalation. You can also integrate Azure Active Directory authentication to provide a more granular level of access. More information can be found at [RBAC Dashboard issue](https://docs.microsoft.com/en-us/azure/aks/kubernetes-dashboard#for-rbac-enabled-clusters). To fix the issue run ```kubectl create clusterrolebinding kubernetes-dashboard --clusterrole=cluster-admin --serviceaccount=kube-system:kubernetes-dashboard```

### Explore Kubernetes Dashboard

1. In the Kubernetes Dashboard select nodes to view
![](img/ui_nodes.png)
2. Explore the different node properties available through the dashboard
3. Explore the different pod properties available through the dashboard ![](img/ui_pods.png)
4. In this lab, feel free to take a look around other resources Kubernetes provides through the dashboard.

> To learn more about Kubernetes objects and resources, browse the documentation: <https://kubernetes.io/docs/user-journeys/users/application-developer/foundational/#section-3>
