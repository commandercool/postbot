const http = require('http');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.method == 'POST') {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => processPost(req, res, body));
  } else {
    res.statusCode = 400;
    res.end('Request is not supported');
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function processPost(req, res, body) {
    const queryObject = url.parse(req.url,true).query;
    res.statusCode = 200;
    res.end(`params: ${JSON.stringify(queryObject)}, data length: ${body}`);
}
