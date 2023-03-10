const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../Controllers/createGroup.controller");

app.post("/create", controller.createGroup);

module.exports = app;