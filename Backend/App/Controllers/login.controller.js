const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../Models");
const User = db.users;

exports.login = async (req, res) => {
  const { cellphone, password } = req.body;

  try {
    const user = await User.find({ cellphone: cellphone });

    if (user.length == 0) {
      return res.status(400).json({ error: "user does not exists" });
    }
    bcrypt.compare(password, user[0].password, (err, results) => {
      if (err) {
        res.status(500).json({
          error: "Server Error",
        });
      } else if (results === true) {
        const token = jwt.sign(
          {
            id: user[0].id,
            cellphone: user[0].cellphone,
            name: user[0].name,
          },
          process.env.JWT_SECRET
        );
        res.status(200).json({
          message: "successfully logged in",
          token: token,
          user: {
            id: user[0].id,
            cellphone: user[0].cellphone,
            name: user[0].name,
            isAvatar: user[0].isAvatar,
            avatar: user[0].avatar,
          },
        });
      } else {
        res.status(400).json({ error: "wrong password" });
      }
    });
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = async (req, res) => {
  const { cellphone } = req.body;

  try {
    const user = await User.findOne({ cellphone: cellphone });

    if (!user) {
      return res.status(200).json(user);
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
