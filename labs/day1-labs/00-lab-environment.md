# Lab Environment

## Classroom Setting

These labs are designed for delivery in a classroom. For these labs we require a Linux-based VM in Azure as a "jumpbox". The first task here is to create this virtual machine and install the required software on it.

Our labs are build and verified using CentOS7. Our recommendations is to use CentOS7. 

### Setup Environment

* Setup your Jumpbox VM in Azure
    1. Browse to http://portal.azure.com
    2. Click on "Create a resource" and search for "CentOS-based 7.5"
    3. Deploy the CentOS-based 7.5 VM (B1ms should be enough, Publisher of CentOS - Rogue Wave Software) - please remember your credentials and also allow inbound on the SSH port for the VM in the NSG configuration.
    4. After the CentOS jumbbox is provisioned in Azure, connect to it using SSH (PuTTY or MobaXTerm)
    5. Connect to your newly created jumpbox
    6. Goto [**Jumpbox Setup**](/labs/helper-files/jumpbox-setup.md) to install the required software

* Setup Azure Cloud Shell: 

    1. Browse to http://portal.azure.com
    2. Login with the Azure credentials
    3. Click on the cloud shell icon to start your session.

        ![alt text](img/cloud-shell-start.png "Spektra ready")

    4. Select `Bash (Linux)`
    5. If you are using CloudShell for the first time, you will be prompted to setup storage for your cloud shell. Click `Show advanced settings`

        ![alt text](img/cloud-show-advanced.png "Spektra ready")

    6. Provide a unique value for Storage account name. This must be all lower case and no punctuation. Use "cloudshell" for File share name. See example below.

        ![alt text](img/cloud-storage-config.png "Spektra ready")

    7. Click `Create storage`

    > Note: You can also use the dedicated Azure Cloud Shell URL: http://shell.azure.com 
