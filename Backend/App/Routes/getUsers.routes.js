const express = require("express");
const app = express();

const bodyparser = require("body-parser");

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

const controller = require("../Controllers/getUsers.controller");
const { verifyJWT } = require("../Middlewares/VerifyOTP");

app.get('/users/:id', controller.getusers);
app.get('/userm', verifyJWT ,controller.getUsersAndGroupsWithMessage);
app.get('/me',verifyJWT, controller.getMe);
app.put('/updatepp/:id', controller.updateProfile);
app.get('/groupmembers/:id', controller.getMembers);
app.get('/group/:id', controller.getGroup);

module.exports = app;