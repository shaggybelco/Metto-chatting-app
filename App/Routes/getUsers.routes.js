const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const controller = require("../controllers/getUsers.controller");

app.get('/users/:id', controller.getusers);
app.get('/userm/:id', controller.getUsersAndGroupsWithMessage);
app.get('/me/:id', controller.getMe);
app.put('/updatepp/:id', controller.updateProfile);

module.exports = app;