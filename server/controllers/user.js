const {
  badRequest,
  created,
  internalServerError,
  notFound,
  ok,
  unauthorized
} = require("../utils/responseUtils");
const { addUserToDatabase, getUserFromDatabase ,getAllUsersFromDatabase, deleteUserFromDatabase, getRecipeFromDatabase} = require("../database");
const { createJWT, comparePassword } = require("../utils/userUtils");

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
    if (!(await addUserToDatabase(req, res))) {
      //If not, returns the badRequest function from the responseUtils directory, which is a helper function for HTTP responses.
      //The function is passed parameters res and an error message.
      return badRequest(
        res,
        "Cannot create duplicate user. Given email exist in the database."
      );
    }
    //If the user can be added to the database, returns the created function from the responseUtils directory,
    //which is passed parameters res and a success message.
    return created(res, "User created successfully");
  } catch (error) {
    console.error("Error creating user to the database:", error);
    return internalServerError(
      res,
      "Internal server error, while creating user"
    );
  }
};

/**
 * The function handles a login request from the frontend.
 * @async
 * @param {Object} req - HTTP request object.
 * @param {Object} res - HTTP response object.
 * @returns {Promise<void>} - Promise indicating the state of execution.
 */  
const loginUser = async (req, res, maxAge) => {
  try {
    const user = await getUserFromDatabase(req, res);
    //First, it checks if the requested user exists in the database.
    if (!user) {
      //If the user is not found, it returns the notFound function from responseUtils, which takes res and an error message as parameters.
      return false;
    }
    if (await comparePassword(req, res, user)) {
      //If the user is found, it calls the createJWT function with parameters req, res, and the user obtained from the getUserFromDatabase function so far.
      const token = createJWT(user.userid, maxAge);
      const details = 
      { token: token,
        user: user,
      }
      return details;
    } else {
      return;
    }
  } catch (error) {
    console.error("Error login the user:", error);
    return internalServerError(res,"Internal server error, while logging in user");
  }
};

const showUser = async (req, res) => {
  try {
    const user = await getUserFromDatabase(req, res);

    //First, it checks if the requested user exists in the database.
    if (!user) {
      //If the user is not found, it returns the notFound function from responseUtils, which takes res and an error message as parameters.
      return notFound(res, "Error finding user from database")
    }
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    return ok(res, "User found from the database", {userWithoutPassword})
  } 
  catch (error) {
    return internalServerError(res,"Internal server error, while getting user details");
  }
};

const showAllUsers = async (req,res) => {
  try {
    const users = await getAllUsersFromDatabase(res);
    if (!users) {
      return notFound(res, "Error finding users from database")
    }
    return ok(res, "User found from the database", {users})
  } 
  catch (error) {
    return internalServerError(res,"Internal server error, while getting users details");
  }
}

const deleteUser = async (res, userid) => {
  try {
    const result = await deleteUserFromDatabase(userid);
    if(!result) {
      return notFound(res, "Error finding user from database")
    }
    return ok(res, "User delete from the database successfully.")
  } catch(error) {
    return internalServerError(res,"Internal server error, while deleting user from database");
  }
}

const getUserRecipe = async (req, res) => {
  try {
    const result = await getRecipeFromDatabase(req,res);
    console.log("MIKSI")
    if(!result) {
      return notFound(res, "Error finding recipe from database")
    }
    return ok(res, "User recipes found from database", {result})
  } catch(error) {
    return internalServerError(res,"Internal server error, while trying to get user's recipes from database");
  }
}

module.exports = { createUser, loginUser, showUser, showAllUsers , deleteUser, getUserRecipe};
