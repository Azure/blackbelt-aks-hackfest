# Deploying your first Application to Kubernetes
_Type: Lab_

_Duration: 3 Mins_

Once you have a running Kubernetes cluster, you can deploy your containerized applications on top of it. To do so, you create a Kubernetes Deployment configuration. The Deployment instructs Kubernetes how to create and update instances of your application. Once you've created a Deployment, the Kubernetes master schedules mentioned application instances onto individual Nodes in the cluster.

Once the application instances are created, a Kubernetes Deployment Controller continuously monitors those instances. If the Node hosting an instance goes down or is deleted, the Deployment controller replaces it. This provides a self-healing mechanism to address machine failure or maintenance.

When you create a Deployment, Kubernetes creates a Pod to host your application instance. A Pod is a Kubernetes abstraction that represents a group of one or more application containers, and some shared resources for those containers. Pods are placed on Nodes that are physical or VMs that the Masters will manage placing workloads on based on resource availability across the nodes.

For now let's just get an application deployed into Kubernetes.

## Exercise 1 - Review the Web service Deployment and Service Manifest

1. Using VSCode open your folder from the clones github library for this lab and open ``~/blackbelt-aks-hackfest/linux-container-workshop/hol_content/lab5_web.yaml``
2. 