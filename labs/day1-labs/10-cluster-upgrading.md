# Upgrade an Azure Kubernetes Service (AKS) cluster

Azure Container Service (AKS) makes it easy to perform common management tasks including upgrading Kubernetes clusters.

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform below steps in the Jumpbox**

## Upgrade an AKS cluster

Before upgrading a cluster, use the `az aks get-versions` command to check which Kubernetes releases are available for upgrade.  Earlier you set \<RESOURCE GROUP NAME\> to 'myaksrg'

```azurecli-interactive
az aks get-versions --resource-group <RESOURCE GROUP NAME> --name <CLUSTER_NAME> --output table
```

**Output:**

```console
Name     ResourceGroup    MasterVersion    MasterUpgrades          NodePoolVersion    NodePoolUpgrades
-------  ---------------  ---------------  ----------------------  -----------------  ----------------------
default  myaksrg          1.10.8           1.10.9, 1.11.4, 1.11.5  1.10.8             1.10.9, 1.11.4, 1.11.5
```

For example for Kubernetes Version 1.10.8 we have three upgrades available: 1.10.9, 1.11.4, 1.11.5. We can use the `az aks upgrade` command to upgrade to the latest available version.  During the upgrade process, nodes are carefully [cordoned and drained](https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/) to minimize disruption to running applications.  Before initiating a cluster upgrade, ensure that you have enough additional compute capacity to handle your workload as cluster nodes are added and removed.

**Note:** 
#### Kubernetes may be unavailable during cluster upgrades. The upgrade may take 10 to 15 minutes.
#### As of today, the remaining lab exercises are tested with version 1.10.* only and we recommend you to upgrade the cluster to version 1.10.9.

### Upgrade the cluster

```azurecli-interactive
az aks upgrade --name <CLUSTER_NAME> --resource-group <RESOURCE GROUP NAME> --kubernetes-version 1.10.9
```

**Output:**

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
      "vmSize": "Standard_DS2_v2",
      "vnetSubnetId": null
    }
  ],
  "dnsPrefix": "myakshyd-myakshyd-xxxx",
  "fqdn": "myakshyd-myakshyd-xxxxxa.hcp.westus.azmk8s.io",
  "id": "/subscriptions/xxxxxxxxxxx/resourcegroups/myakshyd/providers/Microsoft.ContainerService/ma                                                                 nagedClusters/myakshyd",
  "kubernetesVersion": "1.10.9",
  "linuxProfile": {
    "adminUsername": "azureuser",
    "ssh": {
      "publicKeys": [
        {
          "keyData": "ssh-rsa xxxxxxxxx"
        }
      ]
    }
  },
  "location": "westus",
  "name": "myakshyd",
  "provisioningState": "Succeeded",
  "resourceGroup": "myakshyd",
  "servicePrincipalProfile": {
    "clientId": "xxxxxxx",
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
myakshyd     westus      myakshyd         1.10.9               Succeeded            myakshyd-myakshyd-xxxxx.hcp.eastus.azmk8s.io

```

## Attribution:
Content originally created by @gabrtv et al. from [this](https://docs.microsoft.com/en-us/azure/aks/upgrade-cluster) Azure Doc
