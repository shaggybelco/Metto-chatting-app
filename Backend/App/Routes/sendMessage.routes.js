const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../Controllers/sendMessage.controller");

app.post("/messages/:id/:otherId", controller.send);

module.exports = app;