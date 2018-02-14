# Init Containers
This lab will show how to use Kubernetes Init Containers to run scripts and load data prior to the initialization of the primary container.

I'm not going to lie, things are going to get a little weird.

We are going to pull data from a remote source, and then populate the database from that source file. All before the primary container is initialized.

I told you it was going to be weird.

![alt text](two-dragons.gif "a very convincing dragon")

For reference, take a look at the Kubernetes.io docs on Init Containers [ by clicking here ](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)

