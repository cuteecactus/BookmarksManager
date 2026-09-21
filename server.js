const http = require("http");
const fs = require("fs");
const path = require("path");

const config = JSON.parse(fs.readFileSync(path.join(__dirname, "config.json"), "utf-8"));
const PORT = config.port;
const DATA_FILE = path.join(__dirname, config.dataFile);
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
};

function readBookmarks() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ bookmarks: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
}

function writeBookmarks(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

const server = http.createServer((req, res) => {
  
  if (req.method === "GET" && req.url === "/api/bookmarks") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(readBookmarks()));
    return;
  }

  if (req.method === "POST" && req.url === "/api/bookmarks") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      writeBookmarks(JSON.parse(body));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ ok: true }));
    });
    return;
  }

  let filePath = req.url === "/" ? "/index.html" : req.url;
  filePath = path.join(__dirname, filePath);

  const ext = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": MIME[ext] || "text/plain" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Bookmark Manager running at http://localhost:${PORT}`);
});
