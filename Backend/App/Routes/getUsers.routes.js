const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

const controller = require("../controllers/getUsers.controller");

app.get('/users/:id', controller.getusers);
app.get('/userm/:id', controller.getUsersWithMessage)

module.exports = app;