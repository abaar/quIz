const jwt    = require("jsonwebtoken")
const env    = require("../../config/env")

exports.verifyToken = async (req, res, next) =>{
    const token = req.cookies.token || ''
    try
    {
        if(!token){
            return res.status(401).json({'message':"Sesi anda habis, silahkan Login !"});
        }

        const decrpyt = await jwt.verify(token, process.env.JWT_REFRESH);

        req.user = {
            username: decrpyt.username,
        }
        next();
    }catch(err){
        return res.status(500).json({'message':err.toString()});
    }
}