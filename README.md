# Azure Container Hackfest

_Delivering modern cloud native applications with ​open source technologies on Azure​_

## Overview

This workshop will guide you through migrating an application from "on-premise" to containers running in Azure Kubernetes Service.

The labs are based upon a node.js application that allows for voting on the Justice League Superheroes (with more options coming soon). Data is stored in MongoDB.

> Note: These labs are designed to run on a Linux CentOS VM running in Azure (jumpbox) along with Azure Cloud Shell. They can potentially be run locally on a Mac or Windows, but the instructions are not written towards that experience. ie - "You're on your own."

> Note: Since we are working on a jumpbox, note that Copy and Paste are a bit different when working in the terminal. You can use Shift+Ctrl+C for Copy and Shift+Ctrl+V for Paste when working in the terminal. Outside of the terminal Copy and Paste behaves as expected using Ctrl+C and Ctrl+V. 

## Lab Guides - Day 1
  0. [Setup Lab environment](labs/day1-labs/00-lab-environment.md)
  1. [Run app locally to test components](labs/day1-labs/01-setup-app-local.md)
  2. [Create Docker images for apps and push to Azure Container Registry](labs/day1-labs/02-dockerize-apps.md)
  3. [Create an Azure Kubernetes Service (AKS) cluster](labs/day1-labs/03-create-aks-cluster.md)
  4. [Deploy application to Azure Kubernetes Service](labs/day1-labs/04-deploy-app-aks.md)
  5. [Kubernetes UI Overview](labs/day1-labs/05-kubernetes-ui.md)
  6. [Operational Monitoring and Log Management](labs/day1-labs/06-monitoring-k8s.md)
  7. [Application and Infrastructure Scaling](labs/day1-labs/07-cluster-scaling.md)
  8. [Moving your data services to Azure PaaS (CosmosDB)](labs/day1-labs/08-migrate-mongo-to-cosmos.md)
  9. [Update and Deploy New Version of Application](labs/day1-labs/09-update-application.md)
  10. [Upgrade an Azure Kubernetes Service (AKS) cluster](labs/day1-labs/10-cluster-upgrading.md)

## Lab Guides - Day 2

These labs can be completed in no particular order.
  1. [CI/CD Automation](labs/day2-labs/cicd-brigade.md)
  2. [Kubernetes Ingress Controllers](labs/day2-labs/ingress-controller.md)
  3. [Kubernetes InitContainers](labs/day2-labs/init-containers.md)
  4. [Azure Service Broker](labs/day2-labs/open-service-broker.md)
  5. [Persistent Storage](labs/day2-labs/persistent-volumes.md)
  6. [Azure Container Instances and ACI Connector](labs/day2-labs/virtual-kubelet-aci.md)
  7. Kubernetes Stateful Sets (coming soon)
  8. Secrets and ConfigMaps (coming soon)
  9. Helm Charts deep dive (coming soon)
  10. Troubleshooting and debugging (coming soon)
  11. RBAC and Azure AD integration (coming soon)
  
  
## Contributing

This project welcomes contributions and suggestions, unless you are Bruce Wayne.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License

This software is covered under the MIT license. You can read the license [here][license].

This software contains code from Heroku Buildpacks, which are also covered by the MIT license.

This software contains code from [Helm][], which is covered by the Apache v2.0 license.

You can read third-party software licenses [here][Third-Party Licenses].

