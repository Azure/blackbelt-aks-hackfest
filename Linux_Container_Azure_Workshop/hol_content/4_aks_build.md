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
az aks create -n xxx-aks-rg -l eastus
```
4. Create your AKS cluster in the empty resource group created above with 2 nodes, targeting Kubernetes version 1.7.7
```
