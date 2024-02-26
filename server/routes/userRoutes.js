const express = require('express');
const requestUtils = require('../utils/requestUtils')
const router = express.Router();
const user = require('../controllers/user')
const responseUtils = require('../utils/responseUtils')

/**
 * 
 * Handles POST request to create a new user. 
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user creation process is complete.
 */
router.post('/create', async (req, res) => {
  //First, it checks if the received request was in JSON format or not.
    if(!requestUtils.isJson(req)){
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
        return responseUtils.badRequest(res, "Content was not Json");
    }
    //If it was, the user.createUser(req, res) function is returned.
    return user.createUser(req, res);
});



/**
 * Handles POST request to login a user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user login process is complete.
 */
router.post('/login', async (req, res) => {
    //First, it checks if the received request was in JSON format or not.
      if(!requestUtils.isJson(req)){
        //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
        return responseUtils.badRequest(res, "Content was not Json");
      }
      //If it was, the user.loginUser(req, res) function is returned.
      return user.loginUser(req, res);
});

module.exports = router;