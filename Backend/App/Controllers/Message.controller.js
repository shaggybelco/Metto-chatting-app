const db = require("../Models");
const Message = db.messages;
const User = db.users;
const Group = db.groups;

exports.getMessages = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 15; // Number of messages to return per page
    const skip = (page - 1) * pageSize;

    let messages = await Message.find({
      $or: [
        {
          sender: req.params.id,
          receiver: req.params.receiver,
        },
        {
          sender: req.params.receiver,
          receiver: req.params.id,
        },
      ],
      deletedBy: { $nin: [req.params.id] }
    }).sort({ createdAt: -1 });
    // .skip(skip)
    // .limit(pageSize);

    // Check if receiver is a user or a group
    let receiver = await User.findOne({ _id: req.params.receiver });
    if (!receiver) {
      // Receiver is a group
      receiver = await Group.findOne({ _id: req.params.receiver });
      if (!receiver) {
        return res.status(400).send({ message: "Receiver not found" });
      }
      messages = await Message.find({
        receiver: req.params.receiver,
      })
        .populate({
          path: "receiver",
          model: "user" | "group",
        })
        .sort({ createdAt: -1 });
      //     .skip(skip)
      //     .limit(pageSize);
    }

    messages = await Promise.all(
      messages.map(async (message) => {
        const sender = await User.findOne({ _id: message.sender });
        return {
          ...message._doc,
          sender,
          receiver,
        };
      })
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

exports.deleteForOne = async (req, res) => {
  try {
    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.messID,
      { $push: { deletedBy: req.params.id } },
      { new: true }
    );
    console.log(updatedMessage);
    res.status(200).json(updatedMessage);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};
