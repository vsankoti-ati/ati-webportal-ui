# Docker Deployment Guide for ATI Webportal UI

This guide explains how to build and deploy the ATI Webportal UI application using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

## Quick Start

### 1. Build and Run with Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Run in detached mode (background)
docker-compose up -d --build

# Stop the containers
docker-compose down
```

The application will be available at `http://localhost:3000`

### 2. Build and Run with Docker Commands

```bash
# Build the Docker image
docker build -t ati-webportal-ui .

# Run the container
docker run -p 3000:3000 --name ati-webportal ati-webportal-ui

# Run in detached mode
docker run -d -p 3000:3000 --name ati-webportal ati-webportal-ui

# Stop the container
docker stop ati-webportal

# Remove the container
docker rm ati-webportal
```

## Docker Image Details

### Multi-Stage Build
The Dockerfile uses a 3-stage build process:

1. **Dependencies Stage**: Installs production dependencies
2. **Builder Stage**: Installs all dependencies and builds the application
3. **Runner Stage**: Creates the final lightweight production image

### Image Specifications
- **Base Image**: `node:18-alpine` (lightweight Linux)
- **Final Image Size**: ~150-200MB (optimized)
- **Security**: Runs as non-root user (`nextjs`)
- **Health Check**: Built-in health monitoring

## Environment Variables

You can customize the deployment using environment variables:

```bash
# Example with environment variables
docker run -p 3000:3000 \
  -e NODE_ENV=production \
  -e NEXT_TELEMETRY_DISABLED=1 \
  ati-webportal-ui
```

## Production Deployment

### 1. Build for Production
```bash
# Build with production tag
docker build -t ati-webportal-ui:production .

# Tag for registry
docker tag ati-webportal-ui:production your-registry.com/ati-webportal-ui:latest
```

### 2. Push to Container Registry
```bash
# Push to Docker Hub
docker push your-registry.com/ati-webportal-ui:latest

# Or push to Azure Container Registry
az acr login --name yourregistry
docker push yourregistry.azurecr.io/ati-webportal-ui:latest
```

### 3. Deploy to Cloud Platforms

#### Azure Container Instances
```bash
az container create \
  --resource-group myResourceGroup \
  --name ati-webportal \
  --image yourregistry.azurecr.io/ati-webportal-ui:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production
```

#### Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ati-webportal-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ati-webportal-ui
  template:
    metadata:
      labels:
        app: ati-webportal-ui
    spec:
      containers:
      - name: ati-webportal-ui
        image: your-registry.com/ati-webportal-ui:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
```

## Health Monitoring

The container includes a health check endpoint:
- **Endpoint**: `http://localhost:3000/api/health`
- **Check Interval**: Every 30 seconds
- **Timeout**: 10 seconds
- **Retries**: 3 attempts

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   ```bash
   # Use a different port
   docker run -p 3001:3000 ati-webportal-ui
   ```

2. **Build Failures**
   ```bash
   # Clean build (no cache)
   docker build --no-cache -t ati-webportal-ui .
   ```

3. **Container Logs**
   ```bash
   # View logs
   docker logs ati-webportal
   
   # Follow logs in real-time
   docker logs -f ati-webportal
   ```

4. **Container Shell Access**
   ```bash
   # Access running container
   docker exec -it ati-webportal /bin/sh
   ```

### Performance Optimization

1. **Multi-platform Builds**
   ```bash
   # Build for multiple architectures
   docker buildx build --platform linux/amd64,linux/arm64 -t ati-webportal-ui .
   ```

2. **Build Arguments**
   ```bash
   # Optimize for production
   docker build --build-arg NODE_ENV=production -t ati-webportal-ui .
   ```

## Security Considerations

- Container runs as non-root user (`nextjs:nodejs`)
- No sensitive data in image layers
- Minimal attack surface with Alpine Linux
- Regular security updates recommended

## Monitoring and Logging

For production deployments, consider:
- Log aggregation (ELK Stack, Fluentd)
- Metrics collection (Prometheus, Grafana)
- APM tools (Application Performance Monitoring)
- Health check integration with load balancers

## Support

For deployment issues or questions, please refer to:
- Docker documentation: https://docs.docker.com/
- Next.js deployment guides: https://nextjs.org/docs/deployment
- Application-specific documentation in this repository