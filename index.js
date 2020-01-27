require('dotenv').config()

const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');

const pizzas = {
  "DEMARCO":             0,
  "SUPER HERO":          0,
  "SAUSAGE AND PEPPERS": 0,
  "PEPP AND MUSH":       0,
  "BIANCA SUPREME":      0,
  "MELROSE":             0,
  "SUPER SUPREME":       0,
  "MEATBALL":            0,
  "LITTLE ITALY":        0,
  "ITALIAN STALLION":    0,
  "VEG OUT":             0,
  "DRUNK PIG":           0,
};

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  console.log("Index Page Request");

  const response = `<!DOCTYPE html>
<html>
  <head>
    <title>RSVPizza</title>
  </head>
  <body>
    <ul>${
      Object.keys(pizzas).map((pizza) => (
        `<li>${pizza}: ${pizzas[pizza]}</li>`
      )).join("")
    }</ul>
  </body>
</html>`;
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(response);
});

app.post("/sms", (req, res) => {
  const twiml = new MessagingResponse();
  const pizzaRequest = req.body.Body.replace(/[^A-Za-z ]/g, "").toUpperCase();

  console.log(`Incoming Text Message: ${pizzaRequest}`);
  if (pizzas[pizzaRequest] === undefined) {
    twiml.message("Sorry we don't have that sort of pizza.");
  } else {
    twiml.message("Thanks for RSVPing your pizza order!");
    pizzas[pizzaRequest] = (pizzas[pizzaRequest] || 0) + 1;
  }

  res.writeHead(200, {"Content-Type": "text/xml"});
  res.end(twiml.toString());
});

const port = process.env.PORT || 1337;
http.createServer(app).listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
