# Virtual-Kubelet and Azure Container Instances

Virtual Kubelet is an open source Kubernetes kubelet implementation that masquerades as a kubelet for the purposes of connecting Kubernetes to other APIs. This allows the nodes to be backed by other services like ACI, Hyper.sh, AWS, etc. This connector features a pluggable architecture and direct use of Kubernetes primitives, making it much easier to build on.

## How It Works

The diagram below illustrates how Virtual-Kubelet works.

![diagram](img/diagram.svg)
