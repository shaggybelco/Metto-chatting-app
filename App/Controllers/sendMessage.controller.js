const db = require("../Models");
const User = db.users;
const Message = db.messages;
const Group = db.groups;
const GroupMember = db.groupmembers;

exports.send = async (req, res, next) => {
  try {
    if (req.body.recipient_type === "group") {
      const user = await User.findOne({ _id: req.params.id });
      const otherUser = await Group.findOne({ _id: req.params.otherId });
      const isMember = await GroupMember.findOne({ user: req.params.id });

      if (isMember !== null) {
        res.status(400).json({ error: "user is not a member of this group" });
      } else if (user === null && otherUser === null) {
        res.status(400).json({ error: "user does not exist" });
      } else {
        const message = new Message({
          sender: user._id,
          receiver: otherUser._id,
          message: req.body.message,
          recipient_type: req.body.recipient_type,
        });
        message.save(message).then((response) => {
          res.status(200).json(response);
        });
      }
    }

    if (req.body.recipient_type === "user") {
      const user = await User.findOne({ _id: req.params.id });
      const otherUser = await User.findOne({ _id: req.params.otherId });

      if (user === null && otherUser === null) {
        res.status(400).json({ error: "user does not exist" });
      } else {
        const message = new Message({
          sender: user._id,
          receiver: otherUser._id,
          message: req.body.message,
          recipient_type: req.body.recipient_type,
        });
        message.save(message).then((response) => {
          res.status(200).json(response);
        });
      }
    }
  } catch (error) {
    next(error);
  }
};
