# Notes for Build and Deploy of Kube Sync

## Build Process

### Build & Push Latest Version

docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -t sekforde/kube-sync --push .


### Build & Push Latest Version for specific platform

docker buildx build --platform linux/amd64,linux/arm64,linux/arm/v7 -f Dockerfile.pi -t sekforde/kube-sync:pi sekforde/kube-sync --push .

# Deployment

## Docker Only

### Pull Latest Version

docker pull sekforde/kube-sync

### Pull PI Version

docker pull sekforde/kube-sync:pi

### Run Kube Sync on PI

docker run -v yaml-files:/files --env-file ./config.env sekforde/kube-sync

### Run Interactively

docker run -it -v yaml-files:/files --env-file ./config.env sekforde/kube-sync /bin/bash

## Kubernetes

To get running on an EDGE Device using Kubernetes

### Install Kubernetes

#### for Raspberry PI

```
curl -sfL https://get.k3s.io | sh -
```

[for all other platforms the full instructions are here](https://kubernetes.io/docs/tasks/tools/install-kubectl)

#### for MacOS

1. Download the latest release:

```
curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/darwin/amd64/kubectl"
```

2. Make the kubectl binary executable.

```
chmod +x ./kubectl
```

3. Move the binary in to your PATH.

```
sudo mv ./kubectl /usr/local/bin/kubectl
```

4. Test to ensure the version you installed is up-to-date:

```
kubectl version --client
```

#### for Linux

1. Download the latest release:

```
curl -LO https://storage.googleapis.com/kubernetes-release/release/`curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt`/bin/linux/amd64/kubectl
```

2. Make the kubectl binary executable.

```
chmod +x ./kubectl
```

3. Move the binary in to your PATH.

```
sudo mv ./kubectl /usr/local/bin/kubectl
```

4. Test to ensure the version you installed is up-to-date:

```
kubectl version --client
```

### Create Service Account

#### service-account.yaml

this creates a service account called **internal-kubectl**

```
apiVersion: v1
kind: ServiceAccount
metadata:
  name: internal-kubectl
EOF
```

#### role.yaml

this creates a role called **deploy** with the correct permissions to deploy pods

```
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deploy
rules:
  - apiGroups: ["apps"]
    resources:
      - pods
      - deployments
    verbs:
      - get
      - list
      - delete
      - watch
      - create
      - update
      - patch
```

#### role-bindings.yaml

this maps the service account "internal-kubectl" to the role type "deploy"

```
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deploy-pods-to-sa
subjects:
  - kind: ServiceAccount
    name: internal-kubectl
roleRef:
  kind: Role
  name: deploy
  apiGroup: rbac.authorization.k8s.io
```

### kube-sync.yaml

Deploy the Kube Sync Agent using the service account

```
apiVersion: v1
kind: Pod
metadata:
  name: kube-sync
spec:
  serviceAccountName: internal-kubectl
  containers:
    - name: kube-sync
      image: sekforde/kube-sync
```
