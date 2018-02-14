const http = require("http");
const httpProxy = require("http-proxy");

const { IPFS_GATEWAY, IPFS_API, GANACHE_CLI } = require("./env");

var proxy = httpProxy.createProxyServer();

http
  .createServer(async (req, res) => {
    proxy.web(req, res, {
      target: IPFS_GATEWAY
    });
  })
  .listen(8080, async () => {
    console.log("Started proxy: http://localhost:8080");
  });

http
  .createServer(async (req, res) => {
    proxy.web(req, res, {
      target: IPFS_API
    });
  })
  .listen(5001, async () => {
    console.log("Started proxy: http://localhost:5001");
  });

http
  .createServer(async (req, res) => {
    proxy.web(req, res, {
      target: IPFS_API
    });
  })
  .listen(8545, async () => {
    console.log("Started proxy: http://localhost:8545");
  });
