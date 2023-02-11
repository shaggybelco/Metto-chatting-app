const db = require("../Models");
const Message = db.messages;

exports.getMessages = (req, res, next) => {
  console.log(req.params);
  try {
    Message.find({
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
    })
      .populate({
        path: "sender",
        model: "user",
      })
      .populate({
        path: "receiver",
        model: "user",
      })
      .then((user) => {
        // console.log(user);
        res.status(200).json(user);
      });
  } catch (err) {
    console.log(err);
  }
};
