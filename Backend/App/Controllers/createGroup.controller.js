const db = require("../Models");
const Group = db.groups;
const User = db.users;
const GroupMember = db.groupmembers;

module.exports.createGroup = (req,res) => {
    console.log(req.body);
    res.status(200).json(req.body);
}
