const jwt = require("jsonwebtoken");

const authentication = async (req,res,next)=>{
    let token = req.headers['x-api-key'];
    if(!token) return res.status(400).send({status:false,message:"Login to continue"});

    jwt.verify(token,"ideaclan",(err,decode)=>{
        if(err) return res.status(401).send({status:false,message:"Login again to continue"});
        else{
            req.decode = decode;
            next();
        }
    });

};
module.exports = {authentication}