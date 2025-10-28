Infra folder

Contains deployment artifacts for Azure Container Instances (ACI)

Files:
- `azure-pipelines-deploy-aci.yml` - Azure Pipelines YAML to build image, push to ACR, and deploy the ARM template
- `azure-container-instance.parameters.json` - Parameter file for `azure-container-instance.json`

Usage (Azure Pipelines):
1. Create a service connection in Azure DevOps named `azureSubscription` with permissions to the target resource group and ACR.
2. Update pipeline variables: `acrName`, `resourceGroup`, and `location` as needed.
3. Commit and push. The pipeline triggers on `main` branch and will build, push, and deploy automatically.

Manual deployment (CLI):
1. Build and push Docker image to your ACR

```bash
docker build -t atiportal.azurecr.io/ati-webportal-ui:localv4 .
docker push atiportal.azurecr.io/ati-webportal-ui:localv4
```

2. Deploy ARM template with parameters

```bash
az deployment group what-if --resource-group myResourceGroup --template-file azure-container-instance.json --parameters @infra/azure-container-instance.parameters.json

az deployment group create --resource-group myResourceGroup --template-file azure-container-instance.json --parameters @infra/azure-container-instance.parameters.json --name ati-webportal-aci-deployment
```

Security Notes:
- Use Managed Identity or a Service Principal for pipeline authentication
- Store secrets in Azure Key Vault and reference them in the pipeline
- Do not enable anonymous pull access on ACR
