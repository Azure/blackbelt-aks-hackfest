
# Use Persistent Volumes for mongodb database
A persistent volume in an AKS Cluster represents the storage that has been provisioned for use with the AKS pods. Even if the pods are destroyed/recreated, the data stored in the persistent volumes will stay independent of the pod lifecycle. 

In this example we will explore how to use already existing Azure disks as persistent volumes in an AKS Cluster, and use it to store the monogdb files.  
We will create 2 Managed Disks and place the mongodb data and config files on the mounted Azure disks. Finally we will delete the pod and recreate it and attach the same Azure disks which hold mongodb data files and see that the data is persistent.

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) **Perform below steps in the Jumpbox**

## Delete existing deployments
We will start with deleting all the existing deployments of our demo application and making sure that the old instances of DB, WEB and API pods are not running.

```bash
kubectl get deployments
```
```bash
NAME                                              DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
heroes-api-deploy                                 1         1         1            1           22d
heroes-db-deploy                                  1         1         1            1           22d
heroes-web-deploy                                 1         1         1            0           22d
```

Delete all deployments that start with heroes-*

```bash
kubectl delete deployments heroes-api-deploy
kubectl delete deployments heroes-db-deploy
kubectl delete deployments heroes-web-deploy
```
For each of these commands should get a confirmation that the deployment was sucessfully deleted:
```bash
deployment.extensions "heroes-api-deploy" deleted
deployment.extensions "heroes-db-deploy" deleted
deployment.extensions "heroes-web-deploy" deleted
```

After that, there shouldn't be any pods starting with heroes-* left.
```bash
kubectl get pods
```
```bash
No resources found.
```
In case there are a few pods left you can delete them by using the following command:
```bash
kubectl delete pod heroes-db-deploy-... --grace-period=0 --force
```

## Create Azure disks
Before mounting an Azure-managed disk as a Kubernetes volume, the disk to be mounted must be in the same resource group where the AKS Node resides.

Get the Resource Group where the AKS Nodes resides by executing below command. Replace the resourcegroup name and AKS cluster name with the values from your lab.
```
NODEGROUP=`az resource show --resource-group <RG name of AKS cluster> --name <AKS Clustername> --resource-type Microsoft.ContainerService/managedClusters --query properties.nodeResourceGroup -o tsv`
echo $NODEGROUP
```

### Create the datadisk for the mongodb in Azure
```
az disk create \
  --resource-group $NODEGROUP \
  --name mongodb-datadisk  \
  --size-gb 2 \
--sku Standard_LRS \
  --query id --output tsv
```
Once the disk has been created, you should see the last portion of the output like the following. This value is the disk ID, which is used when mounting the datadisk. Keep this value copied to a notepad file.
```
/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/MC_HackFest05_Kubecluster05_eastus/providers/Microsoft.Compute/disks/mongodb-datadisk
```
### Create the configdisk for the mongodb in Azure
```
az disk create \
  --resource-group $NODEGROUP \
  --name mongodb-configdisk  \
  --size-gb 2 \
--sku Standard_LRS \
  --query id --output tsv
```
Once the disk has been created, **copy the disk ID to a notepad file**, which is used when mounting the configdisk.
```
/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/MC_HackFest05_Kubecluster05_eastus/providers/Microsoft.Compute/disks/mongodb-configdisk
```

## Mount the disks as Persistent Volumes
Mount the Azure disks into your pod by configuring the volume in the deployment specification.

Create a new file named **heroes-db-azdisk.yaml** under **~/blackbelt-aks-hackfest/labs/helper-files/** with the following contents in your CentOS jumpbox. 

**NOTE:** Update the **ACR server name** and the **diskURI** for both datadisk and configdisk with the disk IDs obtained while creating the respective disks. Also, take note of the mountPath, which is the path where the Azure disk is mounted inside the heroes-db pod.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mongodb
  labels:
    name: mongodb
spec:
  type: ClusterIP
  ports:
  - name: http
    port: 27017
    targetPort: 27017
  selector:
    name: heroes-db
---
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name:  heroes-db-deploy
  labels:
    name:  heroes-db
spec:
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 1
    type: RollingUpdate
  template:
    metadata:
      labels:
        name:  heroes-db
    spec:
      imagePullSecrets:
        - name: acr-secret
      containers:
      - image:  <acrname>.azurecr.io/azureworkshop/rating-db:v1
        name:  heroes-db-cntnr
        resources:
          requests:
            cpu: "20m"
            memory: "55M"
        ports:
        - containerPort:  27017
          name:  heroes-db
        volumeMounts:
        - mountPath: /data/db
          name: azuredisk-db
        - mountPath: /data/configdb
          name: azuredisk-configdb
        imagePullPolicy: Always
      volumes:
        - name: azuredisk-db
          azureDisk:
            kind: Managed
            diskName: mongodb-datadisk
            diskURI: <datadisk ID>
        - name: azuredisk-configdb
          azureDisk:
            kind: Managed
            diskName: mongodb-configdisk
            diskURI: <configdisk ID>
      restartPolicy: Always
```
Save the _heroes-db-azdisk.yaml_ file.

## Create the DB, WEB and API Pods

Apply the yaml file to create the heroes-db pod with mounted Azure Disks.
```bash
kubectl apply -f heroes-db-azdisk.yaml
```
Edit the _heroes-web-api.yaml_ file and make sure that the MONGO_URI is pointing to the Mongodb running in the heroes-db pod.
```yaml
env:
        - name:  MONGODB_URI
          value: mongodb://mongodb:27017/webratings
        ports:
```
Apply the yaml file to create the heroes-web and heroes-api pods
```bash
kubectl apply -f heroes-web-api.yaml
```
Wait for all the pods to be in the Running status. 
```bash
kubectl get pod
```
```bash
NAME                                 READY     STATUS    RESTARTS   AGE
heroes-api-deploy-77f5fdcbb-xxq46    1/1       Running   0          8m
heroes-db-deploy-678745655b-f82vj    1/1       Running   0          4m
heroes-web-deploy-5dffc9c976-cdll5   1/1       Running   0          8m
```

## Verify the mountpoints and the databases

Verify the mount points  of azure disks inside the DB pod with the below commands.
**NOTE:** You should see 2 disks of 2GB each mounted to the /data/db and /data/configdb paths. 

```bash
kubectl exec -it <DB pod name> bash
```
```bash
root@heroes-db-deploy-678745655b-f82vj:/# df -Th
Filesystem     Type     Size  Used Avail Use% Mounted on
overlay        overlay   30G  4.2G   25G  15% /
tmpfs          tmpfs    1.7G     0  1.7G   0% /dev
tmpfs          tmpfs    1.7G     0  1.7G   0% /sys/fs/cgroup
/dev/sdc       ext4     2.0G  304M  1.5G  17% /data/db
/dev/sdd       ext4     2.0G  3.0M  1.8G   1% /data/configdb
/dev/sda1      ext4      30G  4.2G   25G  15% /etc/hosts
shm            tmpfs     64M     0   64M   0% /dev/shm
tmpfs          tmpfs    1.7G   12K  1.7G   1% /run/secrets/kubernetes.io/serviceaccount
tmpfs          tmpfs    1.7G     0  1.7G   0% /sys/firmware
root@heroes-db-deploy-678745655b-f82vj:/#
```
Run the mongo command and list the databases by running the command 'show dbs' in the mongo shell. 
```
root@heroes-db-deploy-678745655b-vq7l5:/# mongo
MongoDB shell version v3.6.1
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.1
>
> show dbs
admin       0.000GB
config      0.000GB
local       0.000GB
>
```

At this point there will be only 3 default databases namely admin, local and config.  Type `exit` to exit the mongo shell

### Import the webrating database

Run the import.sh file to create the webratings database and load it with initial data.
```bash
root@heroes-db-deploy-678745655b-f82vj:/#cd /
root@heroes-db-deploy-678745655b-f82vj:/# ./import.sh
2018-07-02T11:48:16.546+0000    connected to: localhost
2018-07-02T11:48:16.608+0000    imported 4 documents
2018-07-02T11:48:16.617+0000    connected to: localhost
2018-07-02T11:48:16.710+0000    imported 72 documents
2018-07-02T11:48:16.719+0000    connected to: localhost
2018-07-02T11:48:16.787+0000    imported 2 documents
```

Run the mongo command again and list the databases by running the command 'show dbs' in the mongo shell.  
```bash
root@heroes-db-deploy-678745655b-vq7l5:/# mongo
MongoDB shell version v3.6.1
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.1
>
> show dbs
admin       0.000GB
config      0.000GB
local       0.000GB
webratings  0.000GB
>
```
This time, you will see the webratings database also listed in the output. 

**NOTE:** The imported webratings database information will be stored in the mounted Azure disks.

Type `exit` **2 times** to exit from the mongo shell and the db pod. 

Browse the heroes web application and add some ratings. Make a note of the current ratings.

## Destroy the DB Pod
Now delete the database pod deployment
```bash
kubectl delete deployment heroes-db-deploy
```
Browse the heroes web application and refresh the ratings. You will not be able to see the ratings now.

## Recreate the DB Pod
Now, again apply the yaml file for the db pod **heroes-db-azdisk.yaml** to recreate the DB pod.

This will create a fresh heroes-db pod with the same Azure disks mounted. 

```bash
kubectl apply -f heroes-db-azdisk.yaml 
```
Wait for the db pod to be in running state and verify the mount points of azure disks inside the newly created DB pod. 

```bash
[root@CentoS01 helper-files]# kubectl exec -it <db pod> bash
root@heroes-db-deploy-678745655b-f82vj:/# df -Th
Filesystem     Type     Size  Used Avail Use% Mounted on
overlay        overlay   30G  4.2G   25G  15% /
tmpfs          tmpfs    1.7G     0  1.7G   0% /dev
tmpfs          tmpfs    1.7G     0  1.7G   0% /sys/fs/cgroup
/dev/sdc       ext4     2.0G  304M  1.5G  17% /data/db
/dev/sdd       ext4     2.0G  3.0M  1.8G   1% /data/configdb
/dev/sda1      ext4      30G  4.2G   25G  15% /etc/hosts
shm            tmpfs     64M     0   64M   0% /dev/shm
tmpfs          tmpfs    1.7G   12K  1.7G   1% /run/secrets/kubernetes.io/serviceaccount
tmpfs          tmpfs    1.7G     0  1.7G   0% /sys/firmware
root@heroes-db-deploy-678745655b-f82vj:/#
```
## Validate that the databases are populated from the Azure Disks. 
Run the mongo command and list the databases. 
The DB pod should now automatically use the database files stored in the mounted Azure disks and will populate the webratings database.
```bash
root@heroes-db-deploy-678745655b-vq7l5:/# mongo
MongoDB shell version v3.6.1
connecting to: mongodb://127.0.0.1:27017
MongoDB server version: 3.6.1
>
> show dbs
admin       0.000GB
config      0.000GB
local       0.000GB
webratings  0.000GB
>
```
Browse the heroes web application and check the ratings. You will see the same ratings which you saw earlier. 
