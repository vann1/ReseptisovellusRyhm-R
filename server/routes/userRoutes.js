const express = require("express");
const { isJson } = require("../utils/requestUtils");
const router = express.Router();
const { createUser, loginUser, showUser, showAllUsers, deleteUser } = require("../controllers/user");
const { badRequest, notFound, ok , internalServerError} = require("../utils/responseUtils");
const {requireAuth} = require('../middlewares/authMiddleware');


/**
 *
 * Handles POST request to create a new user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user creation process is complete.
 */
router.post("/create", async (req, res) => {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  //If it was, the user.createUser(req, res) function is returned.
  return createUser(req, res);
});
const maxAge = 60 * 60 * 1000;

/**
 * Handles POST request to login a user.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @returns {Promise<void>} A Promise that resolves when the user login process is complete.
 */
router.post("/login", async (req, res) => {
  const {email} = req.body;
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  //If it was, the user.loginUser(req, res) function is returned.
  const details = await loginUser(req,res,maxAge);
  if (!details) {
    return notFound(res, "User not found in the database");
  } else {
    res.status(200).json({email: email, token: details.token, userid: details.user.userid,role: details.user.ROLE})
  }
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});

router.use(requireAuth);

router.post("/profile", async (req, res) => {
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return showUser(req,res);
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});


router.get("/admin", async (req, res) => {
  try {
  //First, it checks if the received request was in JSON format or not.
  if (!isJson(req)) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return showAllUsers(req,res);
} catch (err){
  return internalServerError(res, "Internal server error: " + err)
}
});

router.delete('/:userId', (req,res) => {
  const userId = req.params.userId;
  try {
    //First, it checks if the received request was in JSON format or not.
    if (!isJson(req)) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return deleteUser(req,res);
  }
  catch (err){
    return internalServerError(res, "Internal server error: " + err)
  }

})
module.exports = router;
