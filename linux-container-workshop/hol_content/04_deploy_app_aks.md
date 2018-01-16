# Deploy the Superhero Ratings App to AKS

## Review/Edit the YAML Config Files

* In VS Code, open the `helper_files` directory and review the yaml files: 

    * lab4_db.yaml
    * lab4_api.yaml
    * lab4_web.yaml

* Note the environment variables that direct each app to other services.
* Update the yaml files for the proper container image name. 
    * You will need to replace the `<login server>` with the ACR login server created in Lab 2. 
    * Repeat this for all 3 yaml files. Example: 

        ```
        spec:
        containers:
        - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:v1
            name:  heroes-web-cntnr
        ```

## Deploy the Applications to AKS

* Use the kubectl CLI to deploy each app

    ```
    cd ./linux-container-workshop/helper_files

    kubectl apply -f lab4_db.yaml
    kubectl apply -f lab4_api.yaml
    kubectl apply -f lab4_web.yaml
    ```

## Validate

* Check to see if pods are running in your cluster

    ```
    kubectl get pods

    NAME                                 READY     STATUS    RESTARTS   AGE
    heroes-api-deploy-1140957751-2z16s   1/1       Running   0          2m
    heroes-db-deploy-2357291595-k7wjk    1/1       Running   0          3m
    heroes-web-1645635641-pfzf9          1/1       Running   0          2m
    ```

* Check to see if services are deployed

    ```
    kubectl get service

    NAME         TYPE           CLUSTER-IP    EXTERNAL-IP      PORT(S)          AGE
    api          LoadBalancer   10.0.20.156   52.176.104.50    3000:31416/TCP   5m
    kubernetes   ClusterIP      10.0.0.1      <none>           443/TCP          12m
    mongodb      ClusterIP      10.0.5.133    <none>           27017/TCP        5m
    web          LoadBalancer   10.0.54.206   52.165.235.114   8080:32404/TCP   5m
    ```

* Browse to the External IP for your web application (on port 8080) and try the app