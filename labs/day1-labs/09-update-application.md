# Update and Deploy New Version of Application

In this lab, we will make a change to the web application and then re-deploy the new container image into AKS. 

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform these steps in the Jumpbox**

## Update web application code

1. Start with a terminal on the **CentOS jumpbox**
2. Navigate to `~/container-bootcamp/app/web/src/components/`
3. Edit code for the `Footer.vue`
4. Find the snippet below *(line 17)* and change the text _"Azure Global Blackbelt Team"_ to your name or whatever you would like to display.

    ```html
    <div class="row at-row flex-center flex-middle">
      <div class="col-lg-6">
      </div>
      <div class="col-lg-12 credits">
        Azure Global Blackbelt Team
      </div>
      <div class="col-lg-6">
      </div>
    </div>
    ```

5. Save your edits and close the file

## Create new container image and push to ACR

1. Browse to `~/container-bootcamp/app/web`
2. You should still have a Dockerfile created in an earlier lab
3. Create a new image with an updated image tag

    ```bash
    docker build -t rating-web:new-version .
    ```

4. Tag the new image and push to your Azure Container Registry. 

    ```bash
    # you may need to login again to your ACR. set these values to yours
    ACR_SERVER=<acr_server>
    ACR_USER=<acr_user>
    ACR_PWD=<acr_pass>

    docker login --username $ACR_USER --password $ACR_PWD $ACR_SERVER

    docker tag rating-web:new-version $ACR_SERVER/azureworkshop/rating-web:new-version
    
    docker push $ACR_SERVER/azureworkshop/rating-web:new-version
    ```

5. Verify that the new version of the image was pushed to ACR by checking your registry in the Azure Portal

## Update kubernetes deployment

There are two ways to update the application with the new version. Both are described below. Choose one to proceed.
1. Edit the YAML file and re-apply
2. Update the deployment and re-set the image tag

### Option 1: Edit YAML and apply

1. As we did in a prior lab, open the  `helper-files` directory and review the file `heroes-web-api.yaml`
2. Update the yaml file and replace the tag from `v1` to `new-version` for heroes-web
    ```yaml
     template:
    metadata:
      labels:
        name:  heroes-web
    spec:
    containers:
    - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:new-version
        name:  heroes-web-cntnr
    ```

3. Apply the new yaml file
    ```bash
    cd ~/container-bootcamp/labs/helper-files

    kubectl apply -f heroes-web-api.yaml
    ```

### Option 2: Update the deployment

1. Set the new image tag on the deployment object
    ```bash
    kubectl get deploy
    ```
    
    ```console
    NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    heroes-api-deploy   1         1         1            1           29m
    heroes-db-deploy    1         1         1            1           32m
    heroes-web-depoy    1         1         1            1           29m
    ```
    
    ```bash
    kubectl set image deployment/heroes-web-deploy heroes-web-cntnr=$ACR_SERVER/azureworkshop/rating-web:new-version
    ```

## Check status

1. You can see the updates and history for the changes from above. The following command will verify that latest deployment was successful.

    ```bash
    kubectl rollout status deployment/heroes-web-deploy
    ```
    
    Each deployment will create a new replicaset:

    ```bash
    kubectl get replicaset | grep web
    ```
    
    ```console    
    heroes-web-556f6f976c          0         0         0         34m
    heroes-web-64f4795689          0         0         0         8m
    heroes-web-67b4b7b887          1         1         1         1m
    ```
    
    ```bash
    kubectl rollout history deployment/heroes-web-deploy
    ```

## Browse to your newly deployed web application

Browse to the web application on the Public IP and validate that the change you made to the 'Footer.vue' file is reflecting in the portal.


   ##### [Return back to BootCamp Table of Contents (Main Page)](/README.md)