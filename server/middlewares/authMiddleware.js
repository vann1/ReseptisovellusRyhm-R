const jwt = require('jsonwebtoken');
const {getUserFromDatabase} = require('../database')
require('dotenv').config();


const requireAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    //check json token exist
    if(token) {
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/login');
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect('/login');
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