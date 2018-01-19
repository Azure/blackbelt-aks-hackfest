# Kubernetes Dashboard

The Kubernetes dashboard is a web ui that lets you view, monitor, and troubleshoot Kubernetes resources. 

### Accessing The Dashboard UI

There are multiple ways of accessing Kubernetes dashboard. You can access through kubectl command-line interface or through the master server API. We'll be using kubectl, as it provides a secure connection, that doesn't expose the UI to the internet.

1. Command-Line Proxy

    * Open a terminal session
    * Run ```kubectl proxy```
    * This creates a local proxy to 127.0.0.1:8001
    * Open a web browser and point to: <http://127.0.0.1:8001/api/v1/proxy/namespaces/kube-system/services/kubernetes-dashboard/#!/cluster?namespace=default>

### Explore Kubernetes Dashboard

1. In the Kubernetes Dashboard select nodes to view
![](img/ui_nodes.png)
2. Explore the different node properties avalabile through the dashboard
3. Explore the different pod properties avaliable through the dashboard ![](img/ui_pods.png)
4. In this lab feel free to take a look around other at  other resources Kubernetes provides through the dashboard
