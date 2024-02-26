const responseUtils = require('../utils/responseUtils')
const database = require('../database')
const userUtils = require('../utils/userUtils')

const createUser = async (req, res) => {
    try {
        if(!await database.addUserToDatabase(req, res)) {
          return responseUtils.badRequest(res, "Cannot create duplicate user. Given email exist in the database.");
        }
        return responseUtils.created(res, "User created successfully");
      } catch (error) {
        console.error('Error creating user to the database:', error);
        return responseUtils.internalServerError(res, "Internal server error, while creating user");
      }
    }


const loginUser = async (req, res) => {
  try {
    const user = await database.getUserFromDatabase(req, res);
    if(user === undefined) {
      return responseUtils.notFound(res, "User not found in the database")
    }
    return userUtils.createJWT(req,res,user);
  } catch (error) {
      console.error("Error login the user:", error)
      return responseUtils.internalServerError(res, "Internal server error, while creating user")

  }
}
module.exports = {createUser, loginUser};