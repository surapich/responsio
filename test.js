let responsio = require("./build");
let express = require("express");

let app = express();
app.use(responsio.expressMiddleware());

app.get("/test/1", (req, res) => {
  res.status(500).respond("Test");
});

app.get("/test/2", (req, res) => {
  res.respond("Test", 500);
});

app.listen(5000);
