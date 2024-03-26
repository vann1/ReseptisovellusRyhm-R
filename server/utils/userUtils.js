const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { unauthorized } = require("../utils/responseUtils");
function validatePassword(password) {
  // Check for at least 8 characters
  if (password.length < 8) {
    return false;
  }

  // Check for at least one uppercase letter
  let uppercaseRegex = /[A-Z]/;
  if (!uppercaseRegex.test(password)) {
    return false;
  }

  // Check for at least one number
  var numberRegex = /\d/;
  if (!numberRegex.test(password)) {
    return false;
  }

  // All conditions met
  return true;
}

function validateName(name) {
  if (name === "") {
    return false;
  }
  return true;
}
function validateUsername(username) {
  if (username === "") {
    return false;
  }
  return true;
}
function validateEmail(email) {
  // Regular expression pattern for a basic email validation
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Test if the provided email matches the pattern
  var isValid = emailRegex.test(email);
  if (!isValid) {
    return false;
  }
  return true;
}

/**
 * Validates user information.
 * @param {string} username - The username to validate.
 * @param {string} email - The email to validate.
 * @param {string} password - The password to validate.
 * @param {string} name - The name to validate.
 * @returns {boolean} Returns true if all validations pass, otherwise false.
 */
function validateUser(username, email, password, name) {
  const isnameValid = validateName(name);
  const isPasswordValid = validatePassword(password);
  const isEmailValid = validateEmail(email);
  const isusernameValid = validateUsername(username);

  // Check if all validations are true
  if (isPasswordValid && isnameValid && isusernameValid && isEmailValid) {
    return true;
  } else {
    return false;
  }
}

/**
 * Creates a JSON Web Token (JWT) for authentication.
 * @param {import('express').Request} req - The request object.
 * @param {import('express').Response} res - The response object.
 * @param {Object} user - The user object containing password for comparison.
 * @returns {Promise<string|import('express').Response>} Returns the generated JWT if authentication is successful, otherwise returns an unauthorized response.
 */
const createJWT1 = async (req, res, user) => {
  //First the function gets the user password from req.body.
  const { password } = req.body;
  //Then it compares the crypted password from database to req.body password.
  if (await bcrypt.compare(password, user.password)) {
    //If these passwords matches, it creates jwt token which is returned.
    const token = jwt.sign(
      { userId: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    return token;
  } else {
    //Else it returns responseUtils.unautorized function with parameters res and error message
    return unauthorized(res, "Virheellinen salasana");
  }
};

const comparePassword = async (req, res, user) => {
  //First the function gets the user password from req.body.
  const { password } = req.body;
  //Then it compares the crypted password from database to req.body password.
  return await bcrypt.compare(password, user.password);
};

const createJWT = (id, maxAge) => {
  return jwt.sign({ id }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: maxAge,
  });
};

// const authenticateToken =(req ,res, next) => {
//   const token = req.header('Authorization');

//   if(!token) {
//     return responseUtils.unauthorized(res, "Access denied. Token missing.");
//   }

//   const tokenValue = token.split(' ')[1];

//   jwt.verify(tokenValue, process.env.ACCESS_TOKEN_SECRET , (err, user)=> {
//     if(err) {
//       return responseUtils.forbidden(res, "Invalid token");
//     }
//     req.user = user;
//     next();
//   })
// }
module.exports = {validatePassword, validateUser, createJWT, comparePassword };
