# Files for Azure Managed Disk Persistent Volume Claim

Tips and tricks for later

```shell
kubectl get pods -l app=azure-managed-hdd -o json | jq '.items[0].spec.nodeName' -r
```
