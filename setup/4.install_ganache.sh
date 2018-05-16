#!/bin/bash
helm install ./components/ganache/charts/ganache-cli/ --name ganache

export KONG_ADMIN_URL=$(minikube service gateway-kong-admin --url | sed 's,http://,https://,g')
export GANACHE_CLUSTER_IP=$(kubectl get service ganache-ganache-cli -o json | jq -r '.spec.clusterIP');
export KONG_PROXY_URL=$(minikube service gateway-kong-proxy --url | sed 's,http://,https://,g')

curl -k -X POST \
  --url $KONG_ADMIN_URL/apis/ \
  --data 'name=ganache' \
  --data 'hosts=ganache.transmute.minikube' \
  --data 'upstream_url=http://'$GANACHE_CLUSTER_IP':8545/' | jq -r '.'

echo "Waiting for Ganache..."
sleep 45
echo "Ganache ready"

curl -k -X POST \
  --url $KONG_PROXY_URL \
  --header "Host: ganache.transmute.minikube" \
  --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":68}' | jq -r '.'
