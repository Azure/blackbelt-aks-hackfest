# Ingress Controllers

This lab will show how to use Kubernetes ingress controllers to route traffic to our Heroes web application.

## Add Ingress Controller to an Azure Kubernetes Service Cluster

There are a number of ingress controllers available today. Here is a quick, but not exhaustive list for reference purposes:

* Nginx
* Traefik
* LinkerD
* Custom Ingress Controllers

For the purposes of this lab we will be focusing in on Nginx and using kube-lego to automatically requests certificates for Kubernetes Ingress resources from Let's Encrypt.

## Install Helm

We are going to be installing Nginx and Kube-Lego into our K8s cluster using Helm and Tiller. You can think of Helm as a package manager for Kubernetes with Tiller being the server-side component.

1. In the Azure Cloud Shell, the Helm CLI is already installed

2. Initialize Helm
    ``` bash
    helm init
    ```

3. Validate Helm and Tiller were installed successfully
    ``` bash
    helm version
    # You should see something like the following as output:
    Client: &version.Version{SemVer:"v2.7.2", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    Server: &version.Version{SemVer:"v2.7.2", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    ```

## Install Nginx using Helm

The Nginx Ingress Controller is an Ingress controller that uses a ConfigMap to store the nginx configuration and provides layer 7 capabilities for applications deployed on Kubernetes.

1. Install Nginx using Helm CLI

    ``` bash
    # The following command will install the Nginx ingress controller into the K8s cluster.

    helm install --name ingress stable/nginx-ingress --namespace kube-system
    ```

2. Validate that Nginx was installed
    ``` bash
    kubectl get pods -n kube-system | grep nginx

    # You should see something like the following as output:
    ingress-nginx-ingress-controller-86bf69bcfc-jqvsg        1/1       Running   0          1d
    ingress-nginx-ingress-default-backend-86d6db4c47-td2k8   1/1       Running   0          1d
    ```
    * The nginx-ingress helm chart deploys a nginx ingress controller and also a backend for the ingress controller. The backend is used when a route is not found and will display a 404 error TODO: add more info on backend
    ``` bash
    kubectl get svc -n kube-system | grep nginx

    # You should see something like the following as output:
    ingress-nginx-ingress-controller       LoadBalancer  10.0.231.143  52.173.190.190  80:30910/TCP,443:30480/TCP  1d
    ingress-nginx-ingress-default-backend  ClusterIP     10.0.175.123  <none>          80/TCP                      1d
    ```
    * The nginx controller will use a LoadBalancer type service where the backend is of type ClusterIP

## Deploy the heroes web\api app with ingress

We will now deploy the application with a configured Ingress resource

1. Switch to the `helper-files` directory and view the
   `heroes-we     b-api-ingress.yaml` file. Change all image field to maych your docker registry url.
    ``` bash
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/helper-files
    ```
2. Edit yaml files to deploy the application

    Edit the following field in the heroes-db.yaml
    * image: <>login server<>/azureworkshop/rating-db:v1 (Login Sever is the login URL for the registry you created in previous exercise)

    Edit the folling fields in heroes-web-api-ingress.yaml
    * image: <>login server<>/azureworkshop/rating-api:v1 (Login Sever is the login URL for the registry you created in previous exercise)
    * image: <>login server<>/azureworkshop/rating-web:v1 (Login Sever is the login URL for the registry you created in previous exercise)

3. Deploy heroes-db.yaml and heroes-web-api-ingress.yaml
    ``` bash
    kubectl apply -f heroes-db.yaml
    kubectl apply -f heroes-web-api-ingress.yaml
    ```
*Note: Below is an example of a Ingress object

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