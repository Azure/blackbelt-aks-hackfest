# Update and Deploy New Version of Application

In this lab, we will make a change to the web application and then re-deploy the new container image into AKS. 

## Update web application code

1. Use the editor of your choice and browse to `~/blackbelt-aks-hackfest/linux-container-workshop/app/web/src/components/`
2. Edit code for the `Footer.vue`
3. Find the snippet below *(line 13)* and change the text _"Azure Global Blackbelt Team"_ to your name or whatever you would like to display.

    ```
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

4. Save your edits and close the file

## Create new container image and push to ACR

1. Browse to `~/blackbelt-aks-hackfest/linux-container-workshop/app/web`
2. You should still have a Dockerfile created in an earlier lab
3. Create a new image with an updated image tag

    ```
    docker build -t rating-web:new-version .
    ```

4. Tag the new image and push to your Azure Container Registry

    ```
    # you may need to login again to your ACR. set these values to yours
    ACR_SERVER=
    ACR_USER=
    ACR_PWD=

    docker login --username $ACR_USER --password $ACR_PWD $ACR_SERVER

    docker tag rating-web:new-version $ACR_SERVER/azureworkshop/rating-web:new-version
    
    docker push $ACR_SERVER/azureworkshop/rating-web:new-version
    ```

5. Verify image was pushed to ACR by checking your registry in the Azure Portal

## Update kubernetes deployment

There are two ways to update the application with the new version. Both are described below. Choose one to proceed.
1. Edit the YAML file and re-apply
2. Update the deployment and re-set the image tag

### Edit YAML and apply

1. As we did in a prior lab, open the  `helper-files` directory and review the file `heroes-web-api.yaml`
2. Update the yaml file and replace the tag from `v1` to `new-version`
    ```
    spec:
    containers:
    - image: mycontainerregistry.azurecr.io/azureworkshop/rating-web:new-version
        name:  heroes-web-cntnr
    ```

3. Apply the new yaml file
    ```
    cd ~/blackbelt-aks-hackfest/linux-container-workshop/helper-files

    kubectl apply -f heroes-web-api.yaml
    ```

### Update the deployment

1. Set the new image tag on the deployment object
    ```
    kubectl get deploy

    NAME                DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    heroes-api-deploy   1         1         1            1           29m
    heroes-db-deploy    1         1         1            1           32m
    heroes-web          1         1         1            1           29m

    kubectl set image deployment/heroes-web heroes-web-cntnr=briarworkshop.azurecr.io/azureworkshop/rating-web:new-version
    ```

2. Check status
    ```
    # this command will verify that latest deployment was successful
    kubectl rollout status deployment/heroes-web

    # each deployment creates a new replicaset
    kubectl get replicaset | grep web
    
    heroes-web-556f6f976c          0         0         0         34m
    heroes-web-64f4795689          0         0         0         8m
    heroes-web-67b4b7b887          1         1         1         1m

    kubectl rollout history deployment/heroes-web
    ```

## Browse to your newly deployed web application
