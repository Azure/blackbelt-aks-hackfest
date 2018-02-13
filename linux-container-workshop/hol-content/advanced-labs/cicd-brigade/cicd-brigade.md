# CI/CD with Brigade

In this lab, we will use Brigade to automate build and delivery of the web application into our AKS cluster. 

Learn more about Brigade here: http://brigade.sh 

> Note. We chose to use Brigade here, but other tools such as Jenkins can perform the same functions.

## Pre-requisites

This lab has pre-requisites. Some have been completed in prior labs.

* Lab #4 deployed the web, api, and database components
* Helm is required. Check to see if Helm is working: 

    ```
    helm version

    Client: &version.Version{SemVer:"v2.7.2", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    Server: &version.Version{SemVer:"v2.7.2", GitCommit:"8478fb4fc723885b155c924d1c8c410b7a9444e6", GitTreeState:"clean"}
    ```

* Github account. If you already have one, you can use it here. Otherwise, go to https://github.com/join to create one. 

## Install Brigade

1. Update helm repo

    ```
    helm repo add brigade https://azure.github.io/brigade
    ```

2. Install brigade chart

    ```
    helm install -n brigade brigade/brigade
    ```

## Setup Brigade Project


## Fork Github Repo


