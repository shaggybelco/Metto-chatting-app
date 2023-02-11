const db = require('../Models')
const User = db.users;

module.exports.getusers = async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } });
  
      res.status(200).json(users);
    } catch (error) {
      console.log(error.message);
    }
  };
  