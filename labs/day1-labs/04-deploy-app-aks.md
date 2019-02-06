# Deploy the Superhero Ratings App to AKS
All the configuration information required to create the pods/containers for SuperHero application in the AKS cluster are stored in the respective yaml files under "~/blackbelt-aks-hackfest/labs/helper-files" location in your jumpbox. 

In this exercise, we will create a "kubernetes secret" to access the private Azure Container Registry(ACR) that you have already setup. We will also update the respective yaml files with the ACR and secret information for AKS to download and use the db, web and api  images that you have uploaded to the ACR. 

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform these steps in the Jumpbox**

## Connect to our previously created AKS Cluster

1. Login to Azure 

    ```azurecli-interactive
    az login
    ```

2. Retrieve the list of AKS cluster

    ```bash
    az aks list --output table
    ```

    ```bash
    Name         Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
    -----------  ----------  ---------------  -------------------  -------------------  ---------------------------------------------
    akscluster1  westeurope  aks              1.11.5               Succeeded            akscluster1-75273d58.hcp.westeurope.azmk8s.io
    ```

3. Retrieve AKS credentials

    ```bash
    az aks get-credentials --name <name> --resource-group <resource group>
    ```

The prevoiusly used command (`az aks get-credential`) downloads the connection details for our AKS cluster and stores them in `.kube/config` which kubectl is using to interact with our cluster.
    
## Review/Edit the YAML Config Files

1. In the Jumpbox edit `heroes-db.yaml` using `vi`
    ```bash
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-db.yaml
    ```
    * Review the yaml file and learn about some of the settings
    * Update the yaml file for the proper container image name
    * You will need to replace the `<login server>` with the ACR login server created in lab 2
    * Example: 

       ```yaml
        containers:
        - image: mycontainerregistry.azurecr.io/azureworkshop/rating-db:v1
            name:  heroes-db-cntnr
        ```

2. In the Jumpbox edit `heroes-web-api.yaml` using `vi`
    ```bash
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    vi heroes-web-api.yaml
    ```
    * Review the yaml file and learn about some of the settings. Note the environment variables that allow the services to connect
    * Update the yaml file for the proper container image names.
    * You will need to replace the `<login server>` with the ACR login server created in lab 2
        > ![#f03c15](https://placehold.it/15/f03c15/000000?text=+)  Note: You will need to update the image name at 2 places in the heroes-web-api.yaml to reference the web and api container images.

    * Example: 
        ```yaml
         containers:
      - image: mycontainerregistry.azurecr.io/azureworkshop/rating-api:v1
        name:  heroes-api-cntnr
        ```
        ```yaml
        containers:
        - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:v1
            name:  heroes-web-cntnr
        ```

## Setup AKS with access to Azure Container Registry

There are a few ways that AKS clusters can access your private Azure Container Registry. Generally the service account that kubernetes utilizes will have rights based on its Azure credentials. 
In our lab config, we must create a [secret](https://kubernetes.io/docs/concepts/configuration/secret/) to allow this access.

In the Azure portal, navigate to the 'Access Keys' section of the Container Registry you have created to get the below values and update them in the shell:

```bash
# set these values to yours
ACR_SERVER=
ACR_USER=
ACR_PWD=
```
Run the following command to create a secret key in the AKS cluster to access your ACR. 
```bash
kubectl create secret docker-registry acr-secret --docker-server=$ACR_SERVER --docker-username=$ACR_USER --docker-password=$ACR_PWD --docker-email=superman@heroes.com
```
You can verify the secret by running the following command:
```bash
kubectl get secret

NAME                  TYPE                                  DATA      AGE
acr-secret            kubernetes.io/dockerconfigjson        1         8s
default-token-xd8wk   kubernetes.io/service-account-token   3         53m
```
> Note: You can review the `heroes-db.yaml` and `heroes-web-api.yaml` to see where the `imagePullSecrets` are configured.

## Deploy database container to AKS

* Use the kubectl CLI to deploy each app
    ```bash
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-db.yaml
    ```

* Get mongodb pod name
    ```bash
    kubectl get pods
    ```
    ```
    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m
    ```
  Assign pod name to variable MONGO_POD
    ```bash
    MONGO_POD=heroes-db-deploy-2357291595-k7wjk
    ```

* Import data into MongoDB using script
    ```bash
    # ensure the pod name variable is set to your pod name
    # once you exec into pod, run the `import.sh` script

    kubectl exec -it $MONGO_POD bash

    root@heroes-db-deploy-2357291595-xb4xm:/# ./import.sh
    2018-01-16T21:38:44.819+0000	connected to: localhost
    2018-01-16T21:38:44.918+0000	imported 4 documents
    2018-01-16T21:38:44.927+0000	connected to: localhost
    2018-01-16T21:38:45.031+0000	imported 72 documents
    2018-01-16T21:38:45.040+0000	connected to: localhost
    2018-01-16T21:38:45.152+0000	imported 2 documents
    root@heroes-db-deploy-2357291595-xb4xm:/# exit
    ```
##### Be sure to exit pod as shown above
## Deploy the web and api containers to AKS

* Use the kubectl CLI to deploy each app

    ```bash
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    kubectl apply -f heroes-web-api.yaml
    ```

## Validate

* Check to see if pods are running in your cluster
    ```bash
    kubectl get pods
    ```
    ```
    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-api-deploy-1140957751-2z16s   1/1       Running   0          2m
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m
    heroes-web-1645635641-pfzf9          1/1       Running   0          2m
    ```

* Check to see if services are deployed.
    ```bash
    kubectl get service

    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    api          LoadBalancer   10.0.20.156   52.176.104.50    3000:31416/TCP   5m
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          12m
    mongodb      ClusterIP      10.0.5.133    <none>           27017/TCP        5m
    web          LoadBalancer   10.0.54.206   52.165.235.114   8080:32404/TCP   5m
    ```

         Refer the respective yaml files to understand how services got created as LoadBalancer and ClusterIP.

* Browse to the External IP for your web application on port 8080 (eg: http://52.165.235.114:8080 in this example) and try the app

> The public IP can take a few minutes to create with a new cluster. Sit back and relax. Maybe check Facebook. 

Now you have the SuperHero Rating App, which can be accessed via Internet from your AKS cluster. 


   ##### [Return back to BootCamp Table of Contents (Main Page)](/README.md)
