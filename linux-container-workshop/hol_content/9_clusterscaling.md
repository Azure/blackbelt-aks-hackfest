# Working with Azure Kubernetes Service Cluster Scaling

Imagine a scenario where your realize that your existing cluster is at capacity and you need to scale it out to add more nodes in order to increase capacity and be able to deploy more PODS.

## Exercise 1 - Scale K8s Cluster
1. Check to see number of current nodes running.
```
kubectl get nodes
```
You should see something like the following as output:
```
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-29249874-0   Ready     agent     22h       v1.8.1
```
2. Add another node to the cluster
```
az aks scale -g <RESOURCE_GROUP_NAME> -n <AKS_CLUSTER_NAME> --node-count <DESIRED_NODE_COUNT>
```
3. Check to see number of nodes has increased or decreased
```
kubectl get nodes
```
You should see something like the following as output:
```
NAME                       STATUS    ROLES     AGE       VERSION
aks-nodepool1-29249874-0   Ready     agent     22h       v1.8.1
aks-nodepool1-29249874-1   Ready     agent     30s       v1.8.1
```

You now have additional node capacity in your Azure Kubernetes Service cluster to be able to provision more PODS.