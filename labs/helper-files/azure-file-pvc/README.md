# Files for Azure Files Persistent Volume Claim

Tips and tricks for later

```shell
kubectl get pods -l app=azure-volume-file -o json | jq '.items[0].spec.nodeName' -r
```
