# Transmute CLI

A command line tool for managing transmute services in minikube, as soon azure, and google. This will assist in the provisioning and initialization of the cluster, and other maintenance tasks.

- [Docs](https://docs.transmute.industries/transmute-cli/1.0.0/)


```
npm i
npm run build
npm run transmute
npm run transmute help
```

## Provision

### provision-minikube

`transmute k8s provision-minikube mytransmutek8s` <-- will create a
k8s cluster using minikube by default it will use minikube, but you can
choose the driver by passing a `--vmdriver=` option on the command line
e.g.

`transmute k8s provision-minikube mytransmutek8s --vmdriver=none`

### provision-azure

`transmute k8s provision-azure mytransmutek8s myGroup` <-- will create a
k8s cluster using azure by default.

#### init

`transmute k8s init mytransmutek8s`

This will prepare your cluster with the base transmute k8s deployment.
