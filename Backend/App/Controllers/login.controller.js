const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

exports.login = async (req, res) => {
    const {cellphone, password} = req.body;

    const SECRET_KEY =
    "iaujshfklausfokjvuorjvksuirefkjauirjkauerfvkajbsru;foajckrabuv";
    
    try{
        const user = await User.find({cellphone: cellphone});
    

        if(user.length == 0){
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
                SECRET_KEY,
                {
                  expiresIn: "5h",
                }
              );
              res.status(200).json({message: 'successfully logged in', token: token});
            }else{
                res.status(400).json({ error: "wrong password" });
            }
          });
    }catch(err){
        console.log(err)
    }
}