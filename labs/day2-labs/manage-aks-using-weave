You can use [Weave](https://www.weave.works/) to display information about Pods, Deployments, Nodes, etc. 

1) Execute the following command to deploy Weave
```
kubectl apply -f "https://cloud.weave.works/k8s/scope.yaml?k8s-version=$(kubectl version | base64 | tr -d '\n')"
```

2) Execute the following command on your local machine to forward Port 4040
```
kubectl port-forward -n weave "$(kubectl get -n weave pod --selector=weave-scope-component=app -o jsonpath='{.items..metadata.name}')" 4040
```

3) Open browser using the following URL
```
http://127.0.0.1:4040
```
