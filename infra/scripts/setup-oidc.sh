#!/usr/bin/env bash
#
# Sets up OIDC (workload identity federation) so GitHub Actions can deploy to
# Azure without any stored secrets / publish profiles.
#
# It creates an Entra app registration + service principal, adds federated
# credentials for this repo, and grants role assignments on the resource group.
#
# Requirements: Azure CLI (`az`) logged in as a user that can create app
# registrations and assign roles (Owner or User Access Administrator on the RG).
#
# Usage:
#   ./infra/scripts/setup-oidc.sh \
#     --subscription <SUBSCRIPTION_ID> \
#     --resource-group website \
#     --repo sanskagarwal/sanskagarwal.com \
#     [--app-name gh-sanskagarwal-deploy] \
#     [--branch main]
#
# After it finishes, add the printed values to GitHub:
#   gh secret set AZURE_CLIENT_ID --body <clientId>
#   gh secret set AZURE_TENANT_ID --body <tenantId>
#   gh secret set AZURE_SUBSCRIPTION_ID --body <subscriptionId>

set -euo pipefail

APP_NAME="gh-sanskagarwal-deploy"
BRANCH="main"
SUBSCRIPTION="eb270aad-4b3b-4ac4-b9f6-30da6e7fa49e"
RESOURCE_GROUP="website"
REPO="sanskagarwal/sanskagarwal.com"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --subscription) SUBSCRIPTION="$2"; shift 2 ;;
    --resource-group) RESOURCE_GROUP="$2"; shift 2 ;;
    --repo) REPO="$2"; shift 2 ;;
    --app-name) APP_NAME="$2"; shift 2 ;;
    --branch) BRANCH="$2"; shift 2 ;;
    -h|--help) grep '^#' "$0" | sed 's/^# \{0,1\}//'; exit 0 ;;
    *) echo "Unknown argument: $1" >&2; exit 1 ;;
  esac
done

if [[ -z "$SUBSCRIPTION" || -z "$RESOURCE_GROUP" || -z "$REPO" ]]; then
  echo "Error: --subscription, --resource-group and --repo are required." >&2
  echo "Run with --help for usage." >&2
  exit 1
fi

command -v az >/dev/null 2>&1 || { echo "Error: Azure CLI (az) is not installed." >&2; exit 1; }

echo "==> Using subscription $SUBSCRIPTION"
az account set --subscription "$SUBSCRIPTION"

TENANT_ID="$(az account show --query tenantId -o tsv)"

echo "==> Ensuring app registration '$APP_NAME' exists"
APP_ID="$(az ad app list --display-name "$APP_NAME" --query '[0].appId' -o tsv)"
if [[ -z "$APP_ID" ]]; then
  APP_ID="$(az ad app create --display-name "$APP_NAME" --query appId -o tsv)"
  echo "    created app $APP_ID"
else
  echo "    reusing app $APP_ID"
fi

echo "==> Ensuring service principal exists"
if ! az ad sp show --id "$APP_ID" >/dev/null 2>&1; then
  az ad sp create --id "$APP_ID" >/dev/null
  echo "    created service principal"
else
  echo "    service principal already exists"
fi

# Wait for the SP to propagate before assigning roles.
SP_OBJECT_ID="$(az ad sp show --id "$APP_ID" --query id -o tsv)"

add_federated_credential() {
  local name="$1" subject="$2"
  echo "==> Federated credential: $name ($subject)"
  if az ad app federated-credential list --id "$APP_ID" --query "[?name=='$name']" -o tsv | grep -q .; then
    echo "    already exists"
    return
  fi
  az ad app federated-credential create --id "$APP_ID" --parameters "{
    \"name\": \"$name\",
    \"issuer\": \"https://token.actions.githubusercontent.com\",
    \"subject\": \"$subject\",
    \"audiences\": [\"api://AzureADTokenExchange\"]
  }" >/dev/null
  echo "    created"
}

# Credential for pushes / workflow_dispatch on the target branch.
add_federated_credential "github-${BRANCH}" "repo:${REPO}:ref:refs/heads/${BRANCH}"
# Credential for the "dev" GitHub Environment (used by other workflows in this repo).
add_federated_credential "github-env-dev" "repo:${REPO}:environment:dev"

RG_SCOPE="/subscriptions/${SUBSCRIPTION}/resourceGroups/${RESOURCE_GROUP}"

assign_role() {
  local role="$1"
  echo "==> Assigning '$role' on $RESOURCE_GROUP"
  az role assignment create \
    --assignee-object-id "$SP_OBJECT_ID" \
    --assignee-principal-type ServicePrincipal \
    --role "$role" \
    --scope "$RG_SCOPE" >/dev/null 2>&1 || echo "    (already assigned or insufficient permissions)"
}

# Contributor: deploy app + infra. User Access Administrator: create the
# Key Vault role assignment defined in main.bicep.
assign_role "Contributor"
assign_role "User Access Administrator"

cat <<EOF

================================================================
OIDC setup complete. Add these to your GitHub repo (Settings >
Secrets and variables > Actions), or run the gh commands below:

  AZURE_CLIENT_ID        $APP_ID
  AZURE_TENANT_ID        $TENANT_ID
  AZURE_SUBSCRIPTION_ID  $SUBSCRIPTION

  gh secret set AZURE_CLIENT_ID --body "$APP_ID"
  gh secret set AZURE_TENANT_ID --body "$TENANT_ID"
  gh secret set AZURE_SUBSCRIPTION_ID --body "$SUBSCRIPTION"
================================================================
EOF
