const jwt    = require("jsonwebtoken")

exports.refreshToken = async (req, res, next) =>{
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
        return res.status(401).json({'message':"Sesi anda habis, silahkan Login !"});
    }
}

exports.verifyToken = async ( req, res, next) =>{
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer'){
        const token = req.headers.authorization.split(' ')[1];
        try{
            if(!token){
                return res.status(401).json({
                    "message" : "Silahkan refresh token!",
                })
            }

            const decrpyt = await jwt.verify(token, process.env.JWT_SECRET);

            req.user = {
                id: decrpyt.id,
                subclass_id : decrpyt.subclass_id,
                class_id : decrpyt.class_id,
                school_id : decrpyt.school_id
            }
            next()
        }catch(err){
            if(err instanceof jwt.TokenExpiredError){
                return res.status(401).json({"refresh":true})
            }
            return res.status(500).json({"message" : err.toString()});
        }
    }else{
        return res.status(401).json({'message':"Sesi anda habis, silahkan Login !"});
    }
}