---
sidebar_position: 1
title: Kubernetes Deployment
description: Deploy GateKey to Kubernetes with Helm
---

# Kubernetes Deployment

Deploy GateKey to Kubernetes using the official Helm chart.

## Prerequisites

- Kubernetes 1.25+
- Helm 3.0+
- kubectl configured for your cluster
- Ingress controller (nginx, traefik, or Istio)
- PostgreSQL (included or external)

## Quick Start

```bash
# Add the Helm repository
helm repo add gatekey https://dye-tech.github.io/gatekey-helm-chart
helm repo update

# Install with default settings
helm install gatekey gatekey/gatekey \
  -n gatekey \
  --create-namespace
```

## Configuration

### Basic Values

Create a `values.yaml`:

```yaml
# Server configuration
server:
  replicaCount: 2
  image:
    repository: dyetech/gatekey-server
    tag: latest

  # Resource limits
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
    requests:
      cpu: 100m
      memory: 128Mi

# Web UI
web:
  replicaCount: 2
  image:
    repository: dyetech/gatekey-web
    tag: latest

# PostgreSQL (included)
postgresql:
  enabled: true
  auth:
    database: gatekey
    username: gatekey
    password: changeme
  primary:
    persistence:
      size: 10Gi

# Ingress
ingress:
  enabled: true
  className: nginx
  hosts:
    - host: vpn.yourcompany.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: gatekey-tls
      hosts:
        - vpn.yourcompany.com

# Admin password
secrets:
  adminPassword: your-secure-password
```

Install with custom values:

```bash
helm install gatekey gatekey/gatekey \
  -n gatekey \
  --create-namespace \
  -f values.yaml
```

### OIDC Configuration

```yaml
server:
  config:
    auth:
      oidc:
        enabled: true
        providers:
          - name: okta
            display_name: "Company SSO"
            issuer: "https://yourcompany.okta.com"
            client_id: "your-client-id"
            client_secret: "your-client-secret"
            redirect_url: "https://vpn.yourcompany.com/api/v1/auth/oidc/callback"
            scopes:
              - openid
              - profile
              - email
              - groups
```

### External PostgreSQL

```yaml
postgresql:
  enabled: false

server:
  config:
    database:
      url: "postgres://gatekey:password@your-db-host:5432/gatekey?sslmode=require"
```

### High Availability

```yaml
server:
  replicaCount: 3
  podDisruptionBudget:
    enabled: true
    minAvailable: 2

web:
  replicaCount: 3
  podDisruptionBudget:
    enabled: true
    minAvailable: 2

postgresql:
  primary:
    replicaCount: 1
  readReplicas:
    replicaCount: 2
```

## Istio Integration

For Istio-based ingress:

```yaml
ingress:
  enabled: false

istio:
  enabled: true
  gateway: istio-system/mesh-gw
  hosts:
    - vpn.yourcompany.com
```

Example VirtualService:

```yaml
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: gatekey
  namespace: gatekey
spec:
  hosts:
    - vpn.yourcompany.com
  gateways:
    - istio-system/mesh-gw
  http:
    - match:
        - uri:
            prefix: /api/
      route:
        - destination:
            host: gatekey-server
            port:
              number: 8080
    - route:
        - destination:
            host: gatekey-web
            port:
              number: 80
```

## GitOps with ArgoCD

Create an ArgoCD Application:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: gatekey
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://dye-tech.github.io/gatekey-helm-chart
    chart: gatekey
    targetRevision: 1.0.0
    helm:
      valueFiles:
        - values.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: gatekey
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
```

## Retrieve Admin Password

If you didn't set a custom admin password:

```bash
kubectl get secret gatekey-admin-password -n gatekey \
  -o jsonpath='{.data.admin-password}' | base64 -d
```

## Verify Deployment

```bash
# Check pods
kubectl get pods -n gatekey

# Check services
kubectl get svc -n gatekey

# Test health endpoint
kubectl port-forward svc/gatekey-server 8080:8080 -n gatekey
curl http://localhost:8080/health
```

## Upgrading

```bash
# Update repo
helm repo update

# Upgrade release
helm upgrade gatekey gatekey/gatekey \
  -n gatekey \
  -f values.yaml
```

## Uninstalling

```bash
helm uninstall gatekey -n gatekey
kubectl delete namespace gatekey
```

## Monitoring

GateKey exposes Prometheus metrics at `/metrics`:

```yaml
# ServiceMonitor for Prometheus Operator
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: gatekey
  namespace: gatekey
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: gatekey-server
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
```

## Troubleshooting

### Check Logs

```bash
# Server logs
kubectl logs -n gatekey -l app.kubernetes.io/component=server -f

# Web UI logs
kubectl logs -n gatekey -l app.kubernetes.io/component=web -f
```

### Database Connection

```bash
# Exec into server pod
kubectl exec -it -n gatekey deploy/gatekey-server -- sh

# Test database connection
psql $DATABASE_URL -c "SELECT 1"
```

### Ingress Issues

```bash
# Check ingress
kubectl get ingress -n gatekey
kubectl describe ingress -n gatekey gatekey

# Check ingress controller logs
kubectl logs -n ingress-nginx -l app.kubernetes.io/name=ingress-nginx
```
