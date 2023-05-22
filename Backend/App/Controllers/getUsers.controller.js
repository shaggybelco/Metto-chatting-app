const db = require("../Models");
const User = db.users;
const Message = db.messages;
const Group = db.groups;
const GroupMember = db.groupmembers;

module.exports.getusers = async (req, res) => {
  try {
    const users = await User.find({});
    // console.log(users);
    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
  }
};

module.exports.getMembers = async (req, res) => {
  try {
    const members = await GroupMember.find({ group: id })
      .populate({
        path: "group",
        model: "group",
      })
      .populate({
        path: "user",
        model: "user",
      });

    res.status(200).json(members);
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findOne({ _id: id }).populate({
      path: "created_by",
      model: "user",
    });
    const members = await GroupMember.find({ group: id })
      .populate({
        path: "group",
        model: "group",
      })
      .populate({
        path: "user",
        model: "user",
      });

    res.status(200).json({ group, members });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

module.exports.getUsersWithMessage = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: id }, { receiver: id }],
    }).sort({ createdAt: -1 });

    const users = await User.find({
      _id: {
        $in: messages
          .filter((m) => m.sender.toString() !== id)
          .map((m) => m.sender)
          .concat(
            messages
              .filter((m) => m.receiver.toString() !== id)
              .map((m) => m.receiver)
          ),
      },
    });

    const lastMessages = [];
    for (const user of users) {
      const filteredMessages = messages.filter(
        (m) =>
          (m.sender.toString() === id &&
            m.receiver.toString() === user._id.toString()) ||
          (m.sender.toString() === user._id.toString() &&
            m.receiver.toString() === id)
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

module.exports.getUsersAndGroupsWithMessage = async (req, res, next) => {
  const id = req.userId;
  try {
    const groupID = await GroupMember.find({ user: { $eq: id } });

    // console.log(groupID);
    if (groupID === null) {
      // res.status(404).send({ error: "Not Found" });
      console.log("No group");
      // return;
    }
    const messages = await Message.find({
      $or: [
        { sender: id },
        { receiver: id },
        { receiver: { $in: groupID?.group } },
      ],
    })
      .populate({
        path: "receiver",
        model: "user" | "group",
        select: "_id name cellphone isAvatar avatar", // Select the specified fields for the "receiver" (User) population
      })
      .populate({
        path: "sender",
        model: "user",
        select: "_id name cellphone isAvatar avatar",
      }) // Select the specified fields for the "sender" (User) population
      .sort({ createdAt: -1 });

    const userIds = messages
      .filter((m) => m.sender._id.toString() !== id)
      .map((m) => m.sender._id)
      .concat(
        messages
          .filter((m) => m.receiver._id.toString() !== id)
          .map((m) => m.receiver._id)
      )
      .concat(id); // add user's id to the array

    const groupIds = messages
      .filter((m) => m.recipient_type === "group")
      .map((m) => m.receiver._id);

    // console.log(groupIds);
    const users = await User.find({
      _id: { $in: userIds },
    }).select("_id name cellphone isAvatar avatar");

    const groups = await Group.find({
      _id: { $in: [...groupID.map((g) => g.group), ...groupIds] },
      // created_by: id,
    });

    // console.log(groups);
    const lastMessages = [];
    for (const user of users) {
      const filteredMessages = messages.filter(
        (m) =>
          (m.sender._id.toString() === id &&
            m.receiver._id.toString() === user._id.toString()) ||
          (m.sender._id.toString() === user._id.toString() &&
            m.receiver._id.toString() === id)
      );
      if (filteredMessages.length) {
        lastMessages.push({
          receiver: user,
          lastMessage: filteredMessages[0],
          unreadCount: filteredMessages.filter(
            (m) => m.read === false && m.receiver._id.toString() === id
          ).length,
          filteredMessages: filteredMessages,
        });
      }
    }

    for (const group of groups) {
      const filteredMessages = messages.filter(
        (m) => m.receiver._id.toString() === group._id.toString()
      );
      if (filteredMessages.length) {
        lastMessages.push({
          receiver: group,
          lastMessage: filteredMessages[0],
          unreadCount: filteredMessages.filter((m) => m.read === false).length,
          filteredMessages: filteredMessages,
        });
      } else {
        // console.log("does not have any messages");
        lastMessages.push({
          receiver: group,
          lastMessage: {
            sender: {
              _id: group._id,
            },
            recipient_type: "group",
            createdAt: group.createdAt,
            message: "New group",
          },
          unreadCount: 0,
          filteredMessages: [],
        });
      }
    }

    res.send({
      lastMessages: lastMessages.sort((a, b) => {
        return (
          new Date(b.lastMessage?.createdAt).getTime() -
          new Date(a.lastMessage?.createdAt).getTime()
        );
      }),
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
    next();
  }
};

// get logged in user
exports.getMe = async (req, res, next) => {
  const id = req.userId;
  try {
    const hold = await User.findOne({ _id: id }).select(
      "_id name cellphone isAvatar avatar"
    );

    res.status(200).json(hold);
  } catch (error) {
    next(error);
  }
};

// update profile

exports.updateProfile = async (req, res, next) => {
  const { image, isAvatar, name } = req.body;
  const id = id;
  console.log(req.body);
  console.log(image);
  try {
    const updated = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          avatar: image,
          isAvatar: isAvatar,
          name: req.body.name,
        },
      },
      { returnOriginal: false }
    );

    res.status(200).json(updated);
  } catch (error) {
    console.log(error);

    res.status(400).json({ message: "Error updating user profile." });
    next(error);
  }
};
