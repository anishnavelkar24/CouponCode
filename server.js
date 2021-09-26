const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');

const fs = require("fs");

// New app using express module
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(cors());
app.use(bodyParser.json());

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/getCoupon", function (req, res) {
  res.send(JSON.parse(fs.readFileSync("data.json")));
});

app.post("/addCoupon", function (req, res) {
  console.log(req.body);

  fs.writeFile(
    "data.json",
    JSON.stringify(req.body, null, 2),
    finishWritingFile
  );
  //res.send("Addition - " + result);
});

app.post("/checkCouponCode", function (req, res) {
  console.log(req.body.code);

  var coupons = JSON.parse(fs.readFileSync("data.json"));
  var success = false;
  
  for (var key in coupons) {
    if (req.body.code === coupons[key].couponCode) {
        success = true;
      res.send(coupons[key]);
      break;
    }
  }
  if(!success) {
      res.send("failed");
  }

  //res.send("Addition - " + result);
});

function finishWritingFile() {
  console.log("file has been overwritten");
}

app.listen(8000, function () {
  console.log("server is running on port 8000");
});
