let responsio = require("./build");
let express = require("express");

let app = express();
app.use(responsio.expressMiddleware());

app.get("/test/1", (req, res) => {
  res.status(500).respond(0, "Success", null);
});

app.get("/test/3", (req, res) => {
  let error = new Error("Message is empty!!!!!!!");
  res.status(502).respond(0, "", "");
});

app.get("/test/2", (req, res) => {
  res.status(502).respond(0, "", "");
});

app.listen(5000);
