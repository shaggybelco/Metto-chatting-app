const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../Controllers/login.controller");

app.post("/log", controller.login);
app.post('/logs', controller.getUser);

module.exports = app;