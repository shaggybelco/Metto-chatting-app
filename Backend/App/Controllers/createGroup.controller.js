const { groupmembers } = require("../Models");
const db = require("../Models");
const Group = db.groups;
const User = db.users;
const GroupMember = db.groupmembers;

module.exports.createGroup = (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      description: req.body.description,
      created_by: req.body.created_by,
      isAvatar: req.body.isAvatar,
      avatar: req.body.avatar,
    });

    group.save(group).then((result) => {
      console.log(result);

      for (let i = 0; i < req.body.users.length; i++) {
        const member = new GroupMember({
          user: req.body.users[i].db._id,
          group: result._id,
        });

        member.save(member).then((members) => {
          console.log(members);
          res.status(200).json(members)
        });
      }

      
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error)
  }
};
