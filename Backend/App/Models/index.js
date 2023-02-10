const dbConfig = require("../configs/db.config");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

mongoose.set('strictQuery', true);
mongoose.set('strictPopulate', false);
const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.users = require("./user.model")(db.mongoose);
db.messages = require("./message.model")(db.mongoose);
db.groups = require("./group.model")(db.mongoose);
db.groupmembers = require("./groupmember.model")(db.mongoose);

module.exports = db;