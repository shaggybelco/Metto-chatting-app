const jwt = require('jsonwebtoken');

module.exports.verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'] ||  req.headers['Authorization'];
    try{
        const barerr  = authHeader.split(' ')[1];
       if (!authHeader) return res.status(401).json({ error: "Unauthorized token missing" });

        jwt.verify(barerr || authHeader, process.env.JWT_SECRET, (err, decode) => {
            if(err) return res.status(403).json({error: "Please logout and login again."})
            req.userId = decode.id;
            req.userData = decode;
            next();
        })
    }catch(e){
        return res.status(401).json({error: "unable to decode token"})
    }
}