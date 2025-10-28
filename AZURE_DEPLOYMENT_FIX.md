# Azure Container Instance Deployment Commands

## Fix for "TargetPort 80 does not match any of the listening ports" Error

Your deployment error indicates that the service is trying to route traffic to port 80, but your Next.js app is listening on port 3000. Here are the correct deployment configurations:

### Option 1: Azure Container Instances (ACI)

```bash
# Deploy using Azure CLI with correct port 3000 and mock authentication
az container create \
  --resource-group myResourceGroup \
  --name ati-webportal-ui \
  --image atiportal.azurecr.io/ati-webportal-ui:localv3 \
  --ports 3000 \
  --ip-address Public \
  --environment-variables NODE_ENV=local NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SKIP_MSAL=true PORT=3000 \
  --cpu 1 \
  --memory 1.5

# Get the public IP
az container show --resource-group myResourceGroup --name ati-webportal-ui --query ipAddress.ip --output tsv
```

### Option 2: Azure Container Apps

```bash
# Create Container App Environment
az containerapp env create \
  --name ati-webportal-env \
  --resource-group myResourceGroup \
  --location eastus

# Deploy Container App with correct port mapping and mock authentication
az containerapp create \
  --name ati-webportal-ui \
  --resource-group myResourceGroup \
  --environment ati-webportal-env \
  --image atiportal.azurecr.io/ati-webportal-ui:localv3 \
  --target-port 3000 \
  --ingress external \
  --env-vars NODE_ENV=local NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SKIP_MSAL=true PORT=3000 \
  --cpu 1.0 \
  --memory 2Gi
```

### Option 3: Kubernetes (AKS)

Use the provided `k8s-deployment.yaml` file:

```bash
# Apply the Kubernetes deployment
kubectl apply -f k8s-deployment.yaml

# Check deployment status
kubectl get pods -l app=ati-webportal-ui
kubectl get service ati-webportal-ui-service

# Get external IP (for LoadBalancer service)
kubectl get service ati-webportal-ui-service --watch
```

### Key Points:

1. **Container Port**: Always use `3000` (what Next.js listens on)
2. **Service Port**: Can be `80` for external traffic 
3. **Target Port**: Must be `3000` (maps external port 80 to container port 3000)

### Troubleshooting Commands:

```bash
# Check container logs
az container logs --resource-group myResourceGroup --name ati-webportal-ui

# Or for Kubernetes
kubectl logs deployment/ati-webportal-ui

# Test health endpoint locally
curl http://your-container-ip:3000/api/health
```

### Environment Variables:
- `NODE_ENV=local` (for testing with mock users)
- `PORT=3000` (Next.js port configuration)
- `NEXT_TELEMETRY_DISABLED=1` (disable telemetry)
- `NEXT_PUBLIC_SKIP_MSAL=true` (CRITICAL: enables mock authentication)

### Debugging Authentication Issues:

If users can't log in, check these steps:

1. **Verify Environment Variables in Container:**
```bash
# Check if environment variables are set correctly
az container exec --resource-group myResourceGroup --name ati-webportal-ui --exec-command "env | grep NEXT"

# Expected output should include:
# NEXT_PUBLIC_SKIP_MSAL=true
# NEXT_TELEMETRY_DISABLED=1
```

2. **Check Browser Developer Console:**
- Open browser dev tools (F12)
- Look for console logs showing:
  ```
  Auth Debug Info: {
    NEXT_PUBLIC_SKIP_MSAL: "true",
    NODE_ENV: "local", 
    shouldSkipMsal: true
  }
  ```

3. **Test Mock Login:**
- Click on demo users in the login page
- Check console for:
  ```
  Dummy login clicked for user: {...}
  Mock login attempted with user: {...}
  User stored in localStorage: {...}
  Login successful, redirecting to home...
  ```

4. **Verify LocalStorage:**
- In browser dev tools → Application → Local Storage
- Should see `mockUser` entry with user data

### Security Headers Added:
- `X-Content-Type-Options: nosniff` (fixes the browser warning)
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Content-Security-Policy` (basic policy)
- `Referrer-Policy: strict-origin-when-cross-origin`

The issue was that your deployment configuration was using `targetPort: 80` instead of `targetPort: 3000`. The Next.js application only listens on port 3000, so all traffic routing must target that port.