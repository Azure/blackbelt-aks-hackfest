# Manage AKS using Weave

## Overview
You can use [Weave](https://www.weave.works/) to display information about Pods, Deployments, Nodes, etc. 

## How it works
1) Execute the following command in **Jumpbox** to deploy Weave

```azurecli-interactive
kubectl apply -f "https://cloud.weave.works/k8s/scope.yaml?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```
The above commands will provision the weave pods in the AKS cluster. You can validate them by executing the following command:
```bash
kubectl get pods -n weave
```

```bash
NAME                              READY     STATUS    RESTARTS   AGE
weave-scope-agent-gdctk           1/1       Running   0          1m
weave-scope-agent-j44bx           1/1       Running   0          1m
weave-scope-app-dbd44d984-5gstd   1/1       Running   0          1m
```
Copy the name of the weave-scope-app pod from the above result and use it in the next step. 

2) Execute the following command on your **local machine** in PowerShell/Command Prompt to forward Port 4040. Login to your azure subscription from command prompt and connect to your kubernetes cluster and then run below steps.

```azurecli-interactive
kubectl port-forward -n weave <your-weavescopeapp-podname> 4040
```

3) Open browser using the following URL and explore the information displayed about Pods, Replicas etc.
```
http://127.0.0.1:4040
```

![image1](img/weave.jpg)
