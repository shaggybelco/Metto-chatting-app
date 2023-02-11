const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../controllers/login.controller");

app.post("/log", controller.login);
app.get('/users/:id', controller.getusers);

module.exports = app;