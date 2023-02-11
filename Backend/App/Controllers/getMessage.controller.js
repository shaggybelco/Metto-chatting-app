const db = require("../Models");
const User = db.users;

exports.getMessages = (req, res, next) => {
    console.log(req.params)
  try {
    User.findOne({
      where: {
        id: req.params.id,
      },
    }).then((user) => {
      console.log(user);
    });
  } catch (err) {
    console.log(err);
  }
};
