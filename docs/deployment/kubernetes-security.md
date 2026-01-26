---
sidebar_position: 2
title: Kubernetes Security Hardening
description: Secure publicly exposed GateKey services on Kubernetes
---

# Kubernetes Security Hardening

This guide covers best practices for securing GateKey's publicly exposed services when deployed on Kubernetes. These recommendations apply to any internet-facing deployment and complement GateKey's built-in zero-trust security model.

## Overview

GateKey exposes several services that may be publicly accessible:

| Service | Port | Purpose |
|---------|------|---------|
| Web UI | 443 | Admin dashboard and user portal |
| API Server | 443 | REST API for clients and gateways |
| Gateway VPN | 1194/UDP or 51820/UDP | OpenVPN or WireGuard connections |

## TLS Termination

### Istio Service Mesh

Istio provides robust TLS termination with automatic certificate management and mTLS between services.

```yaml
apiVersion: networking.istio.io/v1beta1
kind: Gateway
metadata:
  name: gatekey-gateway
  namespace: istio-system
spec:
  selector:
    istio: ingressgateway
  servers:
    - port:
        number: 443
        name: https
        protocol: HTTPS
      tls:
        mode: SIMPLE
        credentialName: gatekey-tls-cert
      hosts:
        - vpn.yourcompany.com
```

Enable strict mTLS for the namespace:

```yaml
apiVersion: security.istio.io/v1beta1
kind: PeerAuthentication
metadata:
  name: default
  namespace: gatekey
spec:
  mtls:
    mode: STRICT
```

### NGINX Ingress Controller

For NGINX-based ingress with hardened TLS settings:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gatekey
  namespace: gatekey
  annotations:
    nginx.ingress.kubernetes.io/ssl-protocols: "TLSv1.3"
    nginx.ingress.kubernetes.io/ssl-ciphers: "ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384"
    nginx.ingress.kubernetes.io/ssl-prefer-server-ciphers: "true"
    nginx.ingress.kubernetes.io/hsts: "true"
    nginx.ingress.kubernetes.io/hsts-max-age: "31536000"
    nginx.ingress.kubernetes.io/hsts-include-subdomains: "true"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - vpn.yourcompany.com
      secretName: gatekey-tls
  rules:
    - host: vpn.yourcompany.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: gatekey-web
                port:
                  number: 80
```

### Traefik

Traefik configuration with TLS hardening:

```yaml
apiVersion: traefik.io/v1alpha1
kind: IngressRoute
metadata:
  name: gatekey
  namespace: gatekey
spec:
  entryPoints:
    - websecure
  routes:
    - match: Host(`vpn.yourcompany.com`)
      kind: Rule
      services:
        - name: gatekey-web
          port: 80
  tls:
    secretName: gatekey-tls
    options:
      name: hardened-tls
---
apiVersion: traefik.io/v1alpha1
kind: TLSOption
metadata:
  name: hardened-tls
  namespace: gatekey
spec:
  minVersion: VersionTLS13
  cipherSuites:
    - TLS_AES_256_GCM_SHA384
    - TLS_CHACHA20_POLY1305_SHA256
```

### Certificate Management with cert-manager

Automate certificate issuance and renewal:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@yourcompany.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
---
apiVersion: cert-manager.io/v1
kind: Certificate
metadata:
  name: gatekey-tls
  namespace: gatekey
spec:
  secretName: gatekey-tls
  issuerRef:
    name: letsencrypt-prod
    kind: ClusterIssuer
  commonName: vpn.yourcompany.com
  dnsNames:
    - vpn.yourcompany.com
```

## Network Policies

Restrict pod-to-pod communication to only what's necessary.

### Default Deny All

Start with a default deny policy:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: gatekey
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
```

### Allow Required Traffic

Then explicitly allow required traffic:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-gatekey-traffic
  namespace: gatekey
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: gatekey-server
  policyTypes:
    - Ingress
    - Egress
  ingress:
    # Allow from ingress controller
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 8080
    # Allow from web UI
    - from:
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: gatekey-web
      ports:
        - protocol: TCP
          port: 8080
  egress:
    # Allow to PostgreSQL
    - to:
        - podSelector:
            matchLabels:
              app.kubernetes.io/name: postgresql
      ports:
        - protocol: TCP
          port: 5432
    # Allow DNS
    - to:
        - namespaceSelector: {}
          podSelector:
            matchLabels:
              k8s-app: kube-dns
      ports:
        - protocol: UDP
          port: 53
```

## Pod Security

### Pod Security Standards

Apply restricted pod security standards:

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: gatekey
  labels:
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

### Security Context

Configure pods with minimal privileges:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gatekey-server
  namespace: gatekey
spec:
  template:
    spec:
      securityContext:
        runAsNonRoot: true
        runAsUser: 65534
        runAsGroup: 65534
        fsGroup: 65534
        seccompProfile:
          type: RuntimeDefault
      containers:
        - name: server
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop:
                - ALL
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
```

## Secrets Management

### External Secrets Operator

Integrate with external secret stores like AWS Secrets Manager, HashiCorp Vault, or Azure Key Vault:

```yaml
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: gatekey-secrets
  namespace: gatekey
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: vault-backend
    kind: ClusterSecretStore
  target:
    name: gatekey-secrets
  data:
    - secretKey: admin-password
      remoteRef:
        key: gatekey/admin
        property: password
    - secretKey: database-url
      remoteRef:
        key: gatekey/database
        property: connection-string
```

### HashiCorp Vault with Sidecar Injection

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gatekey-server
  namespace: gatekey
spec:
  template:
    metadata:
      annotations:
        vault.hashicorp.com/agent-inject: "true"
        vault.hashicorp.com/role: "gatekey"
        vault.hashicorp.com/agent-inject-secret-config: "secret/data/gatekey/config"
```

### Sealed Secrets

For GitOps workflows, use Sealed Secrets to encrypt secrets in Git:

```bash
# Encrypt a secret
kubeseal --format yaml < secret.yaml > sealed-secret.yaml
```

```yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: gatekey-secrets
  namespace: gatekey
spec:
  encryptedData:
    admin-password: AgBy8hCi...
    database-url: AgCtr4Nk...
```

## Rate Limiting and DDoS Protection

### NGINX Ingress Rate Limiting

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: gatekey
  namespace: gatekey
  annotations:
    nginx.ingress.kubernetes.io/limit-rps: "10"
    nginx.ingress.kubernetes.io/limit-connections: "5"
    nginx.ingress.kubernetes.io/limit-rpm: "100"
    nginx.ingress.kubernetes.io/limit-whitelist: "10.0.0.0/8"
```

### Istio Rate Limiting

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: EnvoyFilter
metadata:
  name: ratelimit
  namespace: istio-system
spec:
  workloadSelector:
    labels:
      istio: ingressgateway
  configPatches:
    - applyTo: HTTP_FILTER
      match:
        context: GATEWAY
        listener:
          filterChain:
            filter:
              name: envoy.filters.network.http_connection_manager
      patch:
        operation: INSERT_BEFORE
        value:
          name: envoy.filters.http.local_ratelimit
          typed_config:
            "@type": type.googleapis.com/udpa.type.v1.TypedStruct
            type_url: type.googleapis.com/envoy.extensions.filters.http.local_ratelimit.v3.LocalRateLimit
            value:
              stat_prefix: http_local_rate_limiter
              token_bucket:
                max_tokens: 100
                tokens_per_fill: 10
                fill_interval: 1s
```

## Web Application Firewall (WAF)

### ModSecurity with NGINX Ingress

Enable ModSecurity WAF:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-ingress-controller
  namespace: ingress-nginx
data:
  enable-modsecurity: "true"
  enable-owasp-modsecurity-crs: "true"
  modsecurity-snippet: |
    SecRuleEngine On
    SecAuditLog /var/log/modsec_audit.log
```

### Cloud-Based WAF

Consider placing a cloud WAF in front of your cluster:

- **AWS WAF** with Application Load Balancer
- **Cloudflare** with proxy mode enabled
- **Google Cloud Armor** with GKE Ingress
- **Azure Front Door** with WAF policies

Example Cloudflare configuration in Terraform:

```hcl
resource "cloudflare_ruleset" "gatekey_waf" {
  zone_id = var.cloudflare_zone_id
  name    = "GateKey WAF Rules"
  kind    = "zone"
  phase   = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee" # Cloudflare Managed Ruleset
    }
    expression  = "true"
    description = "Execute Cloudflare Managed Ruleset"
    enabled     = true
  }
}
```

## RBAC and Service Accounts

### Minimal Service Account Permissions

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gatekey-server
  namespace: gatekey
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: gatekey-server
  namespace: gatekey
rules:
  - apiGroups: [""]
    resources: ["configmaps"]
    resourceNames: ["gatekey-config"]
    verbs: ["get", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: gatekey-server
  namespace: gatekey
subjects:
  - kind: ServiceAccount
    name: gatekey-server
roleRef:
  kind: Role
  name: gatekey-server
  apiGroup: rbac.authorization.k8s.io
```

## Image Security

### Image Scanning with Trivy

Integrate vulnerability scanning in your CI/CD:

```yaml
# GitHub Actions example
- name: Scan image
  uses: aquasecurity/trivy-action@master
  with:
    image-ref: dyetech/gatekey-server:${{ github.sha }}
    format: sarif
    output: trivy-results.sarif
    severity: CRITICAL,HIGH
    exit-code: 1
```

### Image Policy with Kyverno

Enforce signed images:

```yaml
apiVersion: kyverno.io/v1
kind: ClusterPolicy
metadata:
  name: verify-image-signature
spec:
  validationFailureAction: Enforce
  rules:
    - name: verify-signature
      match:
        resources:
          kinds:
            - Pod
          namespaces:
            - gatekey
      verifyImages:
        - imageReferences:
            - "dyetech/gatekey-*"
          attestors:
            - entries:
                - keyless:
                    subject: "https://github.com/dye-tech/*"
                    issuer: "https://token.actions.githubusercontent.com"
```

## Audit Logging

### Enable Kubernetes Audit Logging

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
metadata:
  name: gatekey-audit
rules:
  - level: RequestResponse
    namespaces: ["gatekey"]
    verbs: ["create", "update", "patch", "delete"]
    resources:
      - group: ""
        resources: ["secrets", "configmaps"]
  - level: Metadata
    namespaces: ["gatekey"]
```

### Falco Runtime Security

Deploy Falco for runtime threat detection:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: falco-rules
  namespace: falco
data:
  gatekey-rules.yaml: |
    - rule: Unexpected outbound connection from GateKey
      desc: Detect unexpected outbound connections
      condition: >
        outbound and container.name startswith "gatekey"
        and not (fd.sip in (allowed_ips))
      output: >
        Unexpected outbound connection from GateKey
        (connection=%fd.name container=%container.name)
      priority: WARNING
```

## Security Checklist

Use this checklist when deploying GateKey to production:

### Network Security
- [ ] TLS 1.3 enforced on all public endpoints
- [ ] Valid certificates from trusted CA (not self-signed)
- [ ] HSTS headers enabled with long max-age
- [ ] Network policies restrict pod-to-pod traffic
- [ ] Ingress only allows required ports

### Pod Security
- [ ] Pods run as non-root user
- [ ] Read-only root filesystem enabled
- [ ] No privileged containers
- [ ] Resource limits configured
- [ ] Security contexts applied

### Secrets
- [ ] No secrets in environment variables or config files
- [ ] Secrets encrypted at rest (etcd encryption)
- [ ] External secrets management for sensitive data
- [ ] Regular secret rotation configured

### Access Control
- [ ] Minimal RBAC permissions
- [ ] Service account tokens not auto-mounted
- [ ] Admin access requires MFA
- [ ] Audit logging enabled

### Monitoring
- [ ] Security events logged and alerted
- [ ] Image vulnerability scanning in CI/CD
- [ ] Runtime security monitoring (Falco or similar)
- [ ] Regular penetration testing scheduled

## Related Resources

- [Kubernetes Deployment](/docs/deployment/kubernetes) - Basic deployment guide
- [Zero Trust Model](/docs/security/zero-trust) - GateKey's security architecture
- [Monitoring](/docs/admin-guide/monitoring) - Observability setup
