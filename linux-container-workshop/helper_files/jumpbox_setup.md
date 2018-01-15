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

Avoid version 2.4 since it has a bug. Use version 2.3
`yum install azure-cli-2.0.23-1.el7` 

## Clean up Docker

```
docker rm -f $(docker ps -a -q)
docker rmi -f $(docker images)
```
