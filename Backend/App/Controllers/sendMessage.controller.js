const db = require('../Models');
const User = require('../Models');
const Message =  require('../Models');

exports.send = async(req, res, next) => {
    try {
        const user = await User.find({_id: req.params.id});
        const otherUser = await User.find({_id: req.params.otherId});

        const message = await Message.create({
            sender: user._id,
            receiver: otherUser._id,
            message: req.body.message
        });

        res.status(200).json(message);
    } catch (error) {
        next(error);
    }
}