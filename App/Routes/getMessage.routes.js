const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../Controllers/getMessage.controller");

app.get("/messages/:id/:receiver", controller.getMessages);

module.exports = app;