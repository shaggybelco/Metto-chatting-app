const db = require("../Models");
const User = db.users;
const Message = db.messages;

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
