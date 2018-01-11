# Build an Azure Kubernetes Service Cluster

## Exercise 1 - Create AKS cluster through Azure CLI

1. Open your terminal and login to your Azure subscription using the az cli
```
az login
```
2. Verify your subscription is correctly selected as the default
```
az account list
```
3. Create an empty resource Group for your AKS Resource
```
az  group create -n xxx-aks-rg -l eastus
```
4. Create your AKS cluster in the empty resource group created above with 2 nodes, targeting Kubernetes version 1.7.7
```
az aks create -n xxx-aks-c1 -g xxx-aks-rg -c 2 -k 1.7.7
```
5. Get the Kubernetes config files for your new AKS cluster
```
az aks get-credentials -n xxx-aks-c1 -g xxx-aks-rg
```
6. Verify you have API access to your new AKS cluster
```
kubectl get nodes
```

