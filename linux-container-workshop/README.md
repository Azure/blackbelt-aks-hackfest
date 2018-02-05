# Linux Containers on Azure Workshop

_Delivering modern cloud native applications with ​open source technologies on Azure​_

## Overview

This workshop will guide you through migrating an application from "on-premise" to containers running in Azure Kubernetes Service.

The labs are based upon a node.js application that allows for voting on the Justice League Superheroes. Data is stored in MongoDB.

> Note: These labs are designed to run on a Linux CentOS VM running in Azure (jumpbox) along with Azure Cloud Shell. They can potentially be run locally on a Mac or Windows, but the instructions are not written towards that experience. ie - "You're on your own."

> Note: Since we are working on a jumpbox, note that Copy and Paste are a bit different when working in the terminal. You can use Shift+Ctrl+C for Copy and Shift+Ctrl+V for Paste when working in the terminal. Outside of the terminal Copy and Paste behaves as expected using Ctrl+C and Ctrl+V. 

## Hands-on Lab Guide
  1. [Run app locally to test components](hol-content/01-setup-app-local.md)
  2. [Create Docker images for apps and push to Azure Container Registry](hol-content/02-dockerize-apps.md)
  3. [Build an Azure Kubernetes Service (AKS) cluster](hol-content/03-aks-build.md)
  4. [Deploy application to Azure Kubernetes Service](hol-content/04-deploy-app-aks.md)
  5. [Kubernetes UI Overview](hol-content/05-kubernetes-ui.md)
  6. [Operational Monitoring and Log Management](hol-content/06-monitoring-k8s.md)
  7. [Application and Infrastructure Scaling](hol-content/07-cluster-scaling.md)
  8. [Moving your data services to Azure PaaS (CosmosDB)](hol-content/08-migrate-mongo-to-cosmos.md)
  9. [Update and Deploy New Version of Application](hol-content/09-update-application.md)
  10. [Upgrade an Azure Kubernetes Service (AKS) cluster](hol-content/10-cluster-upgrading.md)

## Advanced Labs (Coming Soon)
  1. CI/CD Automation
  2. Persistent Storage
  3. Stateful Sets
  4. Ingress Controllers
  5. Azure Container Instances
  6. Azure Service Broker
  


