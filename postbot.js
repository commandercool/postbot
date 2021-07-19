const http = require('http');
const url = require('url');
const MongoClient = require("mongodb").MongoClient;

const uri = "mongodb://localhost:27017?retryWrites=true&writeConcern=majority";

var posts;

const mongoCli = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function connectMongo() {
  mongoCli.connect();
  posts = mongoCli.db("meter").collection("posts");
}

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

connectMongo();

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

function processPost(req, res, body) {
    // posts.findOne({data: "data"});
    const queryObject = url.parse(req.url,true).query;
    let b64 = Buffer.from(body).toString('base64');
    let post = {};
    post.image = b64;
    post.date = Date.parse(queryObject.date);
    if (!post.date) {
      res.statusCode = 400;
      res.end(`error parsing post date: ${queryObject.date}`);
      return;
    }
    posts.insertOne(post);
    // close response
    res.statusCode = 200;
    res.end(`post date: ${JSON.stringify(post.date)}, data length: ${b64}`);
}
