#!/bin/bash
set -e
export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')
export KONG_PROXY_PORT=$(kubectl get service gateway-kong-proxy -o json | jq -r '.spec.ports[0].nodePort')

echo 'Configure Kong to use Okta to secure IPFS'

curl -k -X POST $KONG_ADMIN_URL/apis/ipfs/plugins \
    --data "name=jwt"

# How to delete a plugin.
# Get the plugin id from the api
# curl -k -X GET $KONG_ADMIN_URL/apis/ipfs/plugins 
# Delete it from the api
# curl -k -X DELETE $KONG_ADMIN_URL/apis/ipfs/plugins/e9522844-ef05-45b1-b3fa-09f380d4c0ec

echo 'Export CONSUMER_ID'
export CONSUMER_ID=$(curl -k -X POST $KONG_ADMIN_URL/consumers \
    --data "username=bob@example.com" \
    --data "custom_id=0" \
    | jq -r '.id')

# Download JWT Signing Key
echo  'Download JWT Signing Key'
echo 'Using vox'
node ./scripts/okta/write-okta-pem.js

# Connect the API Consumer to okta
echo 'Connect the API Consumer to okta'
curl -k -X POST $KONG_ADMIN_URL/consumers/$CONSUMER_ID/jwt \
    -F "algorithm=RS256" \
    -F "rsa_public_key=@./scripts/okta/okta.pem" \
    -F "key=https://"$OKTA_HOSTNAME"/oauth2/default"

# Get an okta jwt
echo 'Get an okta jwt'
export ACCESS_TOKEN=$(node ./scripts/okta/get-okta-token.js)

echo 'Get api v0 id'
curl -k -X GET \
    --url 'https://ipfs.transmute.minikube:'$KONG_PROXY_PORT/api/v0/id \
    --header 'Authorization: Bearer '$ACCESS_TOKEN
