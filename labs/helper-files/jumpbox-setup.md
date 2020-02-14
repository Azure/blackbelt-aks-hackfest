## Jumpbox updates

Internal use only

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

## Update tools (eg AZ CLI)
Import the Microsoft repository key
`sudo rpm --import https://packages.microsoft.com/keys/microsoft.asc`

Create local azure-cli repository information
`sudo sh -c 'echo -e "[azure-cli]\nname=Azure CLI\nbaseurl=https://packages.microsoft.com/yumrepos/azure-cli\nenabled=1\ngpgcheck=1\ngpgkey=https://packages.microsoft.com/keys/microsoft.asc" > /etc/yum.repos.d/azure-cli.repo'`

Avoid version 2.4 since it has a bug. Use version 2.3
`sudo yum install azure-cli-2.0.23-1.el7` 

## Clean up Docker

```
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images)
```
