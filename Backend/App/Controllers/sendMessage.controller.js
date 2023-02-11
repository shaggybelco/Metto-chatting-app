const db = require("../Models");
const User = db.users;
const Message = db.messages;

exports.send = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    const otherUser = await User.findOne({ _id: req.params.otherId });

    console.log(otherUser)
    console.log(user);

    if(user !== null){
      if(otherUser !== null){
        
      }else{

      }
    }

    if (user !== null && otherUser !== null) {
      const message = new Message({
        sender: user._id,
        receiver: otherUser._id,
        message: req.body.message,
        recipient_type: req.body.recipient_type,
      });

      message.save(message).then((response) => {
        res.status(200).json(response);
      });
    } else {
      res.status(400).json({ error: "user does not exist" });
    }
  } catch (error) {
    next(error);
  }
};
