# Init Containers
This lab will show how to use Kubernetes Init Containers to run scripts and load data prior to the initialization of the primary container.

I'm not going to lie, things are going to get a little weird.

We are going to pull data from a remote source, and then populate the database from that source file. All before the primary container is initialized.

I told you it was going to be weird.

![alt text](img/two-dragons.gif "a very convincing dragon")

For reference, take a look at the Kubernetes.io docs on Init Containers [ by clicking here ](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/)

## Download and pre-populate data with init containers

Take note of the two files in this directory, [init-db-sample.yaml](init-db-sample.yaml) and [init-web-api-sample.yaml](init-web-api-sample.yaml). We'll use these as our reference points for deployment.

1. Clear anything out of your cluster by deleting your deployments

    ```bash
    $ kubectl delete -f heroes-db.yaml
    $ kubectl delete -f heroes-web-api.yaml
    ```

2. Modify init-db-sample.yaml in the `helper-files` directory to add your imagePullSecrets as well as reference your container registry and db image
    ```yaml
    spec:
    imagePullSecrets:
        - name: acr-secret
    containers:
    - image:  <login server>/azureworkshop/rating-db:v1
    ```

3. Deploy the db to your cluster with the modified db yaml
    ```bash
    cd ~/blackbelt-aks-hackfest/labs/helper-files

    $ kubectl create -f init-db-sample.yaml
    ```
4. Modify the init-web-api-sample.yaml to add your imagePullSecrets as well as reference your container registry and db image, 

    > note that you only need to add your login info to the top level container(s) - the init containers pull from docker hubs public repo

    change
    ```yaml
          name:  heroes-api
        spec:
          containers:
          - image: sonofjorel/rating-api:v1
    ```

    to

    ```yaml
          name:  heroes-api
        spec:
          imagePullSecrets:
          - name: acr-secret
          containers:
            - image:  <login server>/azureworkshop/rating-api:v1
    ```

    and change
    ```yaml
          name:  heroes-web
        spec:
          containers:
          - image: sonofjorel/rating-web:v1
    ```

    to
    
    ```yaml
          name:  heroes-web
        spec:
          imagePullSecrets:
          - name: acr-secret
          containers:
            - image:  <login server>/azureworkshop/rating-web:v1
    ```

5. Deploy the db to your cluster with the modified db yaml
    ```bash
    $ kubectl create -f init-web-api-sample.yaml
    ```