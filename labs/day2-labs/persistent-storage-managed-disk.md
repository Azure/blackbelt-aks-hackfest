# Persist storage on Azure with Managed Disks

[Managed disks](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/managed-disks-overview) are the recommended way to provision disks inside Azure.  In this walkthrough, we will use Managed Disks to persist data inside Pods

Typically in Kubernetes, you use a Persistent Volume Claim (PVC) to request a data disk and then create a Persistent Volume (PV) from the PVC to mount a the container.

One key difference between managing via Azure Files and Azure Managed Disks is that with Azure Files, you can mount to multiple VM's simultaneously.  This comes at a sacrifice of IO throughput.

## Using an managed disk with Persistent Volume Claim

In this exercise, we will:

* Create the Persistent Volume Claim using the default storage class
* Create the Deployment with 1 Pod using 2 containers that share the PVC
* [Cordon](https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#cordon) the node the pods are running
* Kill the Pod and watch the Node started on a new node and the PV migrate to the new node

### Create the Persistent Volume Claim

Persistent Volumes is how we persist data (via Volumes) that we want to exist beyond the lifespand of a Pod.  A Persistent Volume Claim is how we request Persistent Volumes from the underlying infrastructure.

Additional details:
<https://kubernetes.io/docs/concepts/storage/persistent-volumes/#persistentvolumeclaims>

```shell
kubectl apply -f helper-files/azure-managed-disk-pvc/pvc.yaml

kubectl get pvc
```

### Create the Deployment with 1 Pod using 2 containers that share the PVC

See <https://kubernetes.io/docs/concepts/storage/persistent-volumes/#claims-as-volumes> for more details

We will now create a Deployment because we want to showcase creating a new Pod that writes to the volume, delete that Pod, watch the ReplicaSet re-create the pod on a new node and then watch the Volume mounted inside the new Pod.

The Deployment has a Pod with 2 containers (backend-writer and frontend-webserver) and Service that exposes a public endpoint.

The backend writer container writes a new line to a file in the Persistent Volume every second with the date/time + the Pod's hostname.  The frontend webserver container reads that file and serves it via Apache.

```shell
kubectl apply -f helper-files/azure-managed-disk-pvc/deployment.yaml

kubectl get pod,deploy,service
```

It may take ~3 minutes for the Azure Load Balancer + Public IP to resolve

```shell
IP=`kubectl get svc/azure-managed-hdd -o json  | jq '.status.loadBalancer.ingress[0].ip' -r`
curl $IP
```

Once the service is verified to be up, reverse the contents of the file and only show the last 20 lines.

*Run this command in a separate window to watch the volume migrate to a different host.*

```shell
watch "curl -s $IP | tail -r | head -20"
```

### Cordon the node the pods are running

Now that we have verified the service is up and appending to the logs, let's kill the pod and have a new one start on a new node.

An Azure Managed Disk can only be attached to one node at a time.  So, we want to see how the Deployment reacts if that node goes down.

First, disable scheduling on the existing node.  This prevents any new pods being started on this host.  Then kill the pod to have the Deployment restart a Pod on a different node.

```shell
NODE=`kubectl get pods -l app=azure-managed-hdd -o json | jq '.items[0].spec.nodeName' -r`
kubectl cordon $NODE

POD_NAME=`kubectl get pods -l app=azure-managed-hdd -o json | jq '.items[0].metadata.name' -r`
kubectl delete po/$POD_NAME
```

Now we should see the pod start up on a new node.  Go back to your curl window to watch the service become unavailable and then available again with the writes to a new node.

```shell
kubectl describe pods -l app=azure-managed-hdd
```

## Cleanup

To cleanup, remove the deployment and the PVC

```shell
kubectl delete -f helper-files/azure-managed-disk-pvc/pvc.yaml
kubectl delete -f helper-files/azure-managed-disk-pvc/deployment.yaml
```

## Summary

In this step, we've created a Storage Class, Persistent Volume Claim, and a Deployment with a Pod with 2 containers using the Persistent Volume.  We verified that one container in the Pod could write to the volume and another container in the Pod could read from it.  We then cordon'ed the node to prevent scheduling on it and killed that pod, which had it start on a new node and verified that the service was still available

## Acknowledgments

This walkthrough was inspired by these articles:

* <https://blogs.technet.microsoft.com/livedevopsinjapan/2017/05/16/azure-disk-tips-for-kubernetes/>
* <https://github.com/kubernetes/examples/tree/master/staging/volumes/azure_disk/claim/managed-disk/managed-hdd>