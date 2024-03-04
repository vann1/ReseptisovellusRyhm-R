const responseUtils = require('../utils/responseUtils')
const database = require('../database')
const userUtils = require('../utils/userUtils')


/**
 * Creates a new user in the database. 
 * @async
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {Promise<void>} - Promise indicating the state of execution.
 */

const createUser = async (req, res) => {
    try {
      //First checks if the user can be added to the database.
        if(!await database.addUserToDatabase(req, res)) {
          //If not, returns the badRequest function from the responseUtils directory, which is a helper function for HTTP responses. 
          //The function is passed parameters res and an error message.
          return responseUtils.badRequest(res, "Cannot create duplicate user. Given email exist in the database.");
        }
        //If the user can be added to the database, returns the created function from the responseUtils directory, 
        //which is passed parameters res and a success message.
        return responseUtils.created(res, "User created successfully");
      } catch (error) {
        console.error('Error creating user to the database:', error);
        return responseUtils.internalServerError(res, "Internal server error, while creating user");
      }
    }

    
/**
 * The function handles a login request from the frontend. 
 * @async
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {Promise<void>} - Promise indicating the state of execution.
 */
const loginUser = async (req, res) => {
  try {
    const user = await database.getUserFromDatabase(req, res);
    //First, it checks if the requested user exists in the database.
    if(user === undefined) {
      //If the user is not found, it returns the notFound function from responseUtils, which takes res and an error message as parameters.
      return responseUtils.notFound(res, "User not found in the database")
    }
    //If the user is found, it calls the createJWT function with parameters req, res, and the user obtained from the getUserFromDatabase function so far.
    const token = await userUtils.createJWT(req, res, user);
    //Then code returns responseUtils.ok function with parameters res, successful message and the JWT token.
    return responseUtils.ok(res, "Login successful", { token });
    // return responseUtils.sendJson(res, token, 201);
  } catch (error) {
      console.error("Error login the user:", error)
      return responseUtils.internalServerError(res, "Internal server error, while creating user")

  }
}
module.exports = {createUser, loginUser};