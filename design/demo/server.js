const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 8045;
const ROOT = __dirname;
const AUTH_RESPONSE_DELAY_MS = 2000;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
};

const portalSettings = JSON.parse(
  fs.readFileSync(path.join(ROOT, "getPortalPageSetting.json"), "utf8"),
);

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(payload));
}

function serveStatic(req, res) {
  const urlPath = req.url.split("?")[0];
  const filePath = path.join(ROOT, urlPath === "/" ? "index.html" : urlPath);

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  res.end(fs.readFileSync(filePath));
}

async function handlePortalApi(req, res) {
  const { method, url } = req;

  if (method === "POST" && url === "/portal/getPortalPageSetting") {
    sendJson(res, 200, portalSettings);
    return;
  }

  if (method === "POST" && url === "/portal/radius/auth") {
    setTimeout(function () {
      sendJson(res, 200, {
        errorCode: -41529,
        msg: "Incorrect username or password.",
      });
    }, AUTH_RESPONSE_DELAY_MS);
    return;
  }

  res.writeHead(404);
  res.end("Not found");
}

const server = http.createServer(async (req, res) => {
  if (req.url.startsWith("/portal/")) {
    try {
      await readBody(req);
      await handlePortalApi(req, res);
    } catch (err) {
      console.error(err);
      sendJson(res, 500, { errorCode: -1, message: "Internal server error" });
    }
    return;
  }

  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Portal demo running at http://localhost:${PORT}/index.html`);
  console.log("Mocked endpoints:");
  console.log("  POST /portal/getPortalPageSetting");
  console.log("  POST /portal/radius/auth");
});
