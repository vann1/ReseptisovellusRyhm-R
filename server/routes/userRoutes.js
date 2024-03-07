const express = require('express');
const {isJson} = require('../utils/requestUtils')
const router = express.Router();
const { createUser, loginUser } = require('../controllers/user')
const {badRequest} = require('../utils/responseUtils')


/**
 * 
 * Handles POST request to create a new user. 
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user creation process is complete.
 */
router.post('/create', async (req, res) => {
  //First, it checks if the received request was in JSON format or not.
    if(!isJson(req)){
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
        return badRequest(res, "Content was not Json");
    }
    //If it was, the user.createUser(req, res) function is returned.
    return createUser(req, res);
});



/**
 * Handles POST request to login a user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user login process is complete.
 */
router.post('/login', async (req, res) => {
    //First, it checks if the received request was in JSON format or not.
      if(!isJson(req)){
        //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
        return badRequest(res, "Content was not Json");
      }

      
      console.log("tähän")
      
      //If it was, the user.loginUser(req, res) function is returned.
      res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000})
      return loginUser(req, res);
});



module.exports = router;