const db = require("../Models");
const User = db.users;
const Message = db.messages;
const Group = db.groups;
const GroupMember = db.groupmembers;

module.exports.getusers = async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.params.id } });

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.getUsersWithMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.params.id }, { receiver: req.params.id }],
    }).sort({ createdAt: -1 });

    const users = await User.find({
      _id: {
        $in: messages
          .filter((m) => m.sender.toString() !== req.params.id)
          .map((m) => m.sender)
          .concat(
            messages
              .filter((m) => m.receiver.toString() !== req.params.id)
              .map((m) => m.receiver)
          ),
      },
    });

    const lastMessages = [];
    for (const user of users) {
      const filteredMessages = messages.filter(
        (m) =>
          (m.sender.toString() === req.params.id &&
            m.receiver.toString() === user._id.toString()) ||
          (m.sender.toString() === user._id.toString() &&
            m.receiver.toString() === req.params.id)
      );
      if (filteredMessages.length) {
        lastMessages.push({
          user,
          lastMessage: filteredMessages[0],
        });
      }
    }
    res.send({ lastMessages });
  } catch (error) {
    console.log(error.message);

    res.status(500).json({ message: error.message });
    next();
  }
};

// user and group
module.exports.getUsersAndGroupsWithMessage = async (req, res, next) => {
  try {
    const groupID = await Group.findOne({ user: req.params.id });

    console.log(groupID)

    const messages = await Message.find({
      $or: [{ sender: req.params.id }, { receiver: req.params.id },{receiver:groupID._id}],
    }).sort({ createdAt: -1 });

    const userIds = messages
      .filter((m) => m.receiver.toString() !== req.params.id)
      .map((m) => m.receiver);

    const groupIds = messages
      .filter((m) => m.recipient_type === "group")
      .map((m) => m.receiver);

    const users = await User.find({
      _id: { $in: userIds },
    });

    const groups = await Group.find({
      _id: { $in: groupIds },
    });

    const lastMessages = [];
    for (const user of users) {
      const filteredMessages = messages.filter(
        (m) =>
          (m.sender.toString() === req.params.id &&
            m.receiver.toString() === user._id.toString()) ||
          (m.sender.toString() === user._id.toString() &&
            m.receiver.toString() === req.params.id)
      );
      if (filteredMessages.length) {
        lastMessages.push({
          receiver: user,
          lastMessage: filteredMessages[0],
          unreadCount: filteredMessages.filter((m) => !m.isRead).length,
        });
      }
    }

    for (const group of groups) {
      const filteredMessages = messages.filter(
        (m) => m.receiver.toString() === group._id.toString()
      );
      if (filteredMessages.length) {
        lastMessages.push({
          receiver: group,
          lastMessage: filteredMessages[0],
          unreadCount: filteredMessages.filter((m) => !m.isRead).length,
        });
      }
    }

    res.send({
      lastMessages: lastMessages.sort((a, b) => {
        return (
          new Date(b.lastMessage.createdAt).getTime() -
          new Date(a.lastMessage.createdAt).getTime()
        );
      }),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
    next();
  }
};
