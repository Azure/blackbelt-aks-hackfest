## Setup your Jumpbox

This page helps you to install all required software packages you'll need for this training.

## Reset Password for root user
Login to CentOS VM via a Putty session using the credentials supplied while creating the CentOS VM

* Terminal: `sudo su -`

* Provide the password for the logged in user

* Terminal : `passwd`

* Provide a strong password for the root user. Going forward you may login directly as root user to the VM to execute all of the remaining commands

## Install Mongo

* Terminal: `sudo vi /etc/yum.repos.d/mongodb-org.repo`

* Add the following:

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

* Test connection `mongo localhost:27019`

## Install and Update tools
### Azure CLI
Import the Microsoft repository key.
* Run `sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc`

Create local azure-cli repository information.
* Run `sudo sh -c 'echo -e "[azure-cli]\nname=Azure CLI\nbaseurl=https://packages.microsoft.com/yumrepos/azure-cli\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/azure-cli.repo'`

Install with the yum install command.
* Run `sudo yum install azure-cli-2.0.23-1.el7` 

Avoid version 2.4 since it has a bug. Use version 2.3

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

Install Kubectl command line utility to interact with AKS
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

## Clean up Docker

```
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images)
```
