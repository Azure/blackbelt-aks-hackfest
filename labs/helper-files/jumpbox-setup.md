## Setup your Jumpbox

This page helps you to install all required software packages you'll need for this training.

## Logon to your Jumpbox
Login to CentOS VM via a Putty, Mobaxterm or SSH (in PowerShell) using the credentials supplied while creating the CentOS VM

* You're now logged in with a regular user account. It's **NOT** recommended to login directly using root. 

* Run the following command in the Terminal to get root user permissions:

  ```bash
  sudo -i
  ```

* Or use `sudo` to run commands with elevated permissions:

  ```bash
  sudo <command>
  ```

![#f03c15](https://placehold.it/15/f03c15/000000?text=+) Provide a strong password or use public-key authentication for your Jumpbox because it's accessible publicly. And SSH is usually under heavy fire. 

## Install Mongo

* Terminal: `sudo vi /etc/yum.repos.d/mongodb-org.repo`

* Add the following in the repo file and save the file

```
[mongodb-org-3.6]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.6/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.6.asc
```

* Run `sudo yum install mongodb-org` 

* Change port to 27019 in mongo config. `sudo vi /etc/mongod.conf`

* Run `sudo systemctl start mongod`

* Test connection `mongo localhost:27019` You should see a Welcome to MongoDB shell message (and perhaps some WARNING messages - in most cases you can ignore these). 

* Exit out of the MongoDB shell `> exit`


## Install and Update tools
### Azure CLI
Import the Microsoft repository key.
* Run `sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc`

Create local azure-cli repository information.
* Run `sudo sh -c 'echo -e "[azure-cli]\nname=Azure CLI\nbaseurl=https://packages.microsoft.com/yumrepos/azure-cli\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/azure-cli.repo'`

Install with the yum install command.
* Run `sudo yum install azure-cli` 

### GIT Tools
Install git commandline tools
* Run `sudo yum install git` 

### Install Docker
Install Docker
```
sudo yum install docker
sudo systemctl enable docker
sudo systemctl start docker
```

### Install Node.JS

Install NodeJS and Node Package Manager (NPM)
```
sudo yum install epel-release
sudo yum install npm
```

### Install Kubectl

Install Kubectl command line utility to interact with AKS. There are two ways to install as below:

**First method:**
```
sudo az aks install-cli
```

**Second method:**
```
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://packages.cloud.google.com/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=1
repo_gpgcheck=1
gpgkey=https://packages.cloud.google.com/yum/doc/yum-key.gpg https://packages.cloud.google.com/yum/doc/rpm-package-key.gpg
EOF
yum install -y kubectl 
```

### Install Helm

Install Helm - The Kubernetes Package Manager
```
curl https://raw.githubusercontent.com/kubernetes/helm/master/scripts/get > get_helm.sh 
chmod 700 get_helm.sh
./get_helm.sh 
```

**WARNING** In some cases it's necessary to add the directory manually to your $PATH variable.

```output
helm not found. Is /usr/local/bin in your $PATH?
Failed to install helm
```

To fix this issue you have to add /usr/local/bin to your $PATH variable

```bash
PATH=$PATH:/usr/local/bin
```

To make this permanently and not only for the current session you can add it to your .bash_profile which is executed everytime a bash is started.

```bash
echo 'export PATH=/usr/local/bin:$PATH' >>~/.bash_profile
```

## Clean up Docker

Optionally, you can run the following commands to remove any docker containers and images if the Jumpbox is not a new one and had run docker previously. The below commands need not be run if this is the firs time you are installing Docker on this VM
```
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images)
```
 ##### [Return to Lab Environment Setup Page](/labs/day1-labs/00-lab-environment.md)
