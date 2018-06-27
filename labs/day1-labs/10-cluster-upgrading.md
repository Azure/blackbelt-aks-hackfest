# Upgrade an Azure Kubernetes Service (AKS) cluster

Azure Container Service (AKS) makes it easy to perform common management tasks including upgrading Kubernetes clusters.

## Upgrade an AKS cluster

Before upgrading a cluster, use the `az aks get-versions` command to check which Kubernetes releases are available for upgrade.

```azurecli-interactive
az aks get-versions --name <CLUSTER_NAME> --resource-group <RESOURCE GROUP NAME> --output table
```

Output:

```console
Name     ResourceGroup    MasterVersion    MasterUpgrades    NodePoolVersion    NodePoolUpgrades
-------  ---------------  ---------------  ----------------  -----------------  ------------------
default  myaksrgtest      1.9.6            1.10.3            1.9.6              1.10.3

```

We have one version available for upgrade: 1.10.3. We can use the `az aks upgrade` command to upgrade to the latest available version.  During the upgrade process, nodes are carefully [cordoned and drained][kubernetes-drain] to minimize disruption to running applications.  Before initiating a cluster upgrade, ensure that you have enough additional compute capacity to handle your workload as cluster nodes are added and removed.

Note:
Kubernetes may be unavailable during cluster upgrades. The upgrade may take 10 to 15 minutes.

```azurecli-interactive
az aks upgrade --name <CLUSTER_NAME> --resource-group <RESOURCE GROUP NAME> --kubernetes-version 1.10.3
```

Output:

```json
{
  "agentPoolProfiles": [
    {
      "count": 2,
      "dnsPrefix": null,
      "fqdn": null,
      "name": "nodepool1",
      "osDiskSizeGb": null,
      "osType": "Linux",
      "ports": null,
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_D1_v2",
      "vnetSubnetId": null
    }
  ],
  "dnsPrefix": "myaksrgtes-myaksrgtest-9a4f9a",
  "fqdn": "myaksrgtes-myaksrgtest-9a4f9a-88c59529.hcp.eastus.azmk8s.io",
  "id": "/subscriptions/<SubscriptionID>/resourcegroups/myak                                                                                                             srgtest/providers/Microsoft.ContainerService/managedClusters/myaksrgtest",
  "kubernetesVersion": "1.10.3",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": ".."
        }
      ]
    }
  },
  "location": "eastus",
  "name": "myaksrgtest",
  "provisioningState": "Succeeded",
  "resourceGroup": "myaksrgtest",
  "servicePrincipalProfile": {
    "clientId": "9f5aeb08-2e46-41ba-8b49-c13a51d5992e",
    "keyVaultSecretRef": null,
    "secret": null
  },
  "tags": null,
  "type": "Microsoft.ContainerService/ManagedClusters"
}

```

You can now confirm the upgrade was successful with the `az aks show` command.

```azurecli-interactive
az aks show --name <CLUSTER_NAME> --resource-group <RESOURCE GROUP NAME> --output table
```

Output:

```json
Name         Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
-----------  ----------  ---------------  -------------------  -------------------  -----------------------------------------------------------
myaksrgtest  eastus      myaksrgtest      1.10.3               Succeeded            myaksrgtes-myaksrgtest-9a4f9a-88c59529.hcp.eastus.azmk8s.io

```

## Attribution:
Content originally created by @gabrtv et al. from [this](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster) Azure Doc
