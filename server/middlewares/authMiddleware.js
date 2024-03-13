const jwt = require('jsonwebtoken');
const {getUserFromDatabaseById} = require('../database')
require('dotenv').config();


const requireAuth = async (req, res, next) => {
    const {authorization} = req.headers;
    if(!authorization){
        return res.status(401).json({error: 'Authorization token required'})
    }
    const token = authorization.split(' ')[1];
    try {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        next();
    }catch(err) {
        console.log(err)
        res.status(401).json({error: 'Request is not authorized'});
    }
}   


const checkUser =(req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null;
                next();
            }
            else {
                let user = await getUserFromDatabase(req,res);
                res.locals.user = user;
                next();
            }
        });
    }
    else {
        res.locals.user = null;
        next();
    }
}
module.exports = {requireAuth, checkUser};