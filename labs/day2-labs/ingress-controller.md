# Ingress Controllers

This lab will show how to use [Kubernetes ingress controllers](https://kubernetes.io/docs/concepts/services-networking/ingress/#ingress-controllers) to route traffic to our Heroes web application.

## Add Ingress Controller to an Azure Kubernetes Service Cluster

There are a number of ingress controllers available today. Here is a quick, but not exhaustive list for reference purposes:

* Nginx
* Traefik
* LinkerD
* Custom Ingress Controllers

For the purposes of this lab we will be using Nginx as our ingress controller. 

## Configure Helm

We will use Helm to install Nginx. We had configured Helm in prior labs. 

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform below steps in the Jumpbox**

1. Connect to the jumpbox and open shell

2. Validate your Helm install by running the below commands.

    ``` bash
    helm version

    # You should see something like the following as output:
    Client: &version.Version{SemVer:"v2.9.1", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    Server: &version.Version{SemVer:"v2.9.1", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    ```

    > Note: If helm was not configured, you must run `helm init`

## Install Nginx using Helm

The Nginx Ingress Controller is an Ingress controller that uses a ConfigMap to store the nginx configuration and provides layer 7 capabilities for applications deployed on Kubernetes.

1. Install Nginx using Helm CLI

    ``` bash
    # The following command will install the Nginx ingress controller into the K8s cluster.

    helm install --name ingress stable/nginx-ingress --namespace kube-system --set rbac.create=true --set rbac.createRole=true --set rbac.createClusterRole=true
    ```

2. Validate that Nginx was installed
    
    ``` bash
    kubectl get pods -n kube-system | grep nginx

    # You should see something like the following as output:
    ingress-nginx-ingress-controller-86bf69bcfc-jqvsg        1/1       Running   0          1d
    ingress-nginx-ingress-default-backend-86d6db4c47-td2k8   1/1       Running   0          1d
    ```

    * The nginx-ingress helm chart deploys a nginx ingress controller and also a backend for the ingress controller. The backend is used when a route is not found and will display a 404 error. You can browse to the public IP to preview this. 

    ``` bash
    kubectl get svc -n kube-system | grep nginx

    # You should see something like the following as output:
    ingress-nginx-ingress-controller       LoadBalancer  10.0.231.143  52.173.190.190  80:30910/TCP,443:30480/TCP  1d
    ingress-nginx-ingress-default-backend  ClusterIP     10.0.175.123  <none>          80/TCP                      1d
    ```

    * The nginx controller will use a LoadBalancer type service where the backend is of type ClusterIP

## Deploy the heroes web\api app with Ingress

We will now deploy the application with a configured Ingress resource.

1. Switch to `helper-files` directory. Clear anything out of your cluster by deleting your deployments

    ```bash
    $ kubectl delete -f heroes-db.yaml
    $ kubectl delete -f heroes-web-api.yaml
    ```

2. View the `heroes-web-api-ingress.yaml` file.

2. Change all image field in the YAML files to match your Azure Container registry url.

    * Update the yaml files for the proper container image names.
    * You will need to replace the `<login server>` with the ACR login server created in earlier labs.
        > Note: You will update the image name TWICE updating the web and api container images and ONCE in the database container image.

        * Example: 

            ```
            spec:
            containers:
            - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:v1
                name:  heroes-web-cntnr
            ```

3. Deploy heroes-db.yaml and import the data

    ``` bash
    kubectl apply -f heroes-db.yaml
    ```

    ```
    # exec into pod and import data
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m

    MONGO_POD=heroes-db-deploy-2357291595-k7wjk

    kubectl exec -it $MONGO_POD bash

    root@heroes-db-deploy-2357291595-xb4xm:/# ./import.sh

    2018-01-16T21:38:44.819+0000	connected to: localhost
    2018-01-16T21:38:44.918+0000	imported 4 documents
    2018-01-16T21:38:44.927+0000	connected to: localhost
    2018-01-16T21:38:45.031+0000	imported 72 documents
    2018-01-16T21:38:45.040+0000	connected to: localhost
    2018-01-16T21:38:45.152+0000	imported 2 documents
    root@heroes-db-deploy-2357291595-xb4xm:/# exit

    # be sure to exit pod as shown above
    ```

4. Create an additional web pod instance for load balancing
* Update the heroes-web-api-ingress.yaml file and change the number of replicas for heroes-web-deploy to 2.

```yaml
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name:  heroes-web-deploy
  labels:
    name:  heroes-web
spec:
  replicas: 2
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:

```

4. Deploy heroes-web-api-ingress.yaml

    ``` bash
    kubectl apply -f heroes-web-api-ingress.yaml
    ```

    > Note: Below is an example of a Ingress object

    ```yaml
    ---
    apiVersion: extensions/v1beta1
    kind: Ingress
    metadata:
    name: heroes-web-ingress
    annotations:
        kubernetes.io/ingress.class: nginx
        # Add to generate certificates for this ingress
        kubernetes.io/tls-acme: 'false'
    spec:
    rules:
        - host:
        http:
            paths:
            - backend:
                serviceName: web
                servicePort: 8080
                path: /
    ```
5. Validate the pods
* There will be 2 pods runnning for web-deploy and one each for db-deploy and api-deploy
``` bash
kubectl get pods

NAME                                 READY     STATUS    RESTARTS   AGE
heroes-api-deploy-74fcf46688-ndrzl   1/1       Running   0          50s
heroes-db-deploy-7d6bf97b54-d5n9z    1/1       Running   0          1m
heroes-web-deploy-8695d44cdb-7wrgq   1/1       Running   0          50s
heroes-web-deploy-8695d44cdb-mkzzx   1/1       Running   0          50s
```
6. Browse to the web app via the Ingress Controller

```
# get ingress external IP
kubectl get svc -n kube-system | grep ingress

ingress-nginx-ingress-controller        LoadBalancer   10.0.155.205   52.186.29.245   80:32045/TCP,443:31794/TCP   2h
ingress-nginx-ingress-default-backend   ClusterIP      10.0.171.59    <none>          80/TCP                       2h
```

* Using the external IP of the controller from the above output, go to http://52.186.29.245 

> Note: you will likely see a privacy SSL warning

## Test the Load Balancing

Refresh the page multiple times and notice the change in the name of the pod and the IP address as shown in example snippets below:


![Screenshot1](img/web-heroes1.png "Web-Heroes1")

![Screenshot2](img/web-heroes2.png "Web-Heroes2")

