const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const responseUtils = require('../utils/responseUtils')
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
    if(name === '') {

      return false;
    }
    return true;
  }
  function validateUsername(username) {
    if(username === '') {

      return false;
    }
    return true;
  }
  function validateEmail(email) {
    // Regular expression pattern for a basic email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    // Test if the provided email matches the pattern
    var isValid = emailRegex.test(email);
    if(!isValid) {
      return false;
    }
    return true;
  } 

  function validateUser(username, email, password ,name) {
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

  const createJWT = async (req,res,user) => {
    const { password } = req.body;
    if(await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ userId: user.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      console.log(token)
      res.json({ message: 'Kirjautuminen onnistui', token });
    }
    else {
      return responseUtils.unauthorized(res, "Virheellinen salasana")
    }

  }

  module.exports = {validateUser, createJWT}