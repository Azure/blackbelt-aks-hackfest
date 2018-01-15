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
        - image: mycontainerregistry.azurecr.io/rating-web:v1
            name:  heroes-web-cntnr
        ```

## Deploy the Applications to AKS

* Use the kubectl CLI to deploy each app

    ```
    cd ./Linux_Container_Azure_Workshop/helper_files

    kubectl apply -f lab4_db.yaml
    kubectl apply -f lab4_api.yaml
    kubectl apply -f lab4_web.yaml
    ```

## Validate

* Check to see if pods are running in your cluster

    ```
    kubectl get pods
    ```

* Check to see if services are deployed

    ```
    kubectl get service
    ```

* Browse to the public IP for your web application and try the app