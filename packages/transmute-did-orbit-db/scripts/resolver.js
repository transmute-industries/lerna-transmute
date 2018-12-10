var http = require("http");

console.log("Resolver Started: ");

const didData = require("../src/data/did_document.json");

const { orbitDIDResolver } = require("./utils/orbitHelpers");

console.log(`http://localhost:7000/1.0/identifiers/${didData.id}`);

(async () => {
  http
    .createServer(async (req, resp) => {
      if (req.url === "/favicon.ico") {
        resp.writeHead(200, { "Content-type": "text/plan" });
        resp.write("Hello Node JS Server Response");
        resp.end();
      }

      if (req.url.indexOf("/1.0/identifiers/") === 0) {
        const did = req.url.split("/1.0/identifiers/")[1];

        try {
          const data = await orbitDIDResolver(did);
          const didDoc = JSON.stringify(data);
          resp.writeHead(200, { "Content-type": "application/json" });
          resp.write(didDoc);
        } catch (e) {
          console.log(e);
          resp.writeHead(500, { "Content-type": "application/json" });
          resp.write(
            JSON.stringify({
              error: 406,
              message: "DID Document signature could not be verified."
            })
          );
        }

        resp.end();
      }
    })

    .listen(7000);
})();
