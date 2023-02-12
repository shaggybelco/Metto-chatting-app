// const db = require("../Models");
// const Message = db.messages;

// exports.getMessages = (req, res, next) => {
//   console.log(req.params);
//   try {
//     Message.find({
//       $or: [
//         {
//           sender: req.params.id,
//           receiver: req.params.receiver,
//         },
//         {
//           sender: req.params.receiver,
//           receiver: req.params.id,
//         },
//       ],
//     })
//       .populate({
//         path: "sender",
//         model: "user",
//       })
//       .populate({
//         path: "receiver",
//         model: "user" | "groups",
//       })
//       .then((user) => {
//         // console.log(user);
//         res.status(200).json(user);
//       });
//   } catch (err) {
//     console.log(err);
//   }
// };


const db = require("../Models");
const Message = db.messages;
const User = db.users;
const Group = db.groups;

exports.getMessages = async (req, res, next) => {
  try {
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
    })
    .sort({ createdAt: 1 });
    
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
      }).populate({
        path: 'receiver',
        model: 'user' | 'group',
      })
      .sort({ createdAt: 1 });
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
    res.status(200).json( messages );
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
