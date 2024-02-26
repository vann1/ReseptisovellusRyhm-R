const express = require('express');
const sql = require('mssql');
const config = require('../config/config');
const responseUtils = require("../utils/responseUtils")
const requestUtils = require('../utils/requestUtils')
const router = express.Router();
const recipe = require("../controllers/recipe")

router.post('/add', async (req, res) => {
    if(!requestUtils.isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return responseUtils.badRequest(res, "Content was not Json");
    }
    return recipe.addRecipe(req, res);
  });

module.exports = router;