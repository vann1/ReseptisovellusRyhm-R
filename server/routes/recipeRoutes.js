const express = require('express');
const sql = require('mssql');
const config = require('../config/config');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const router = express.Router();
const {addRecipe} = require("../controllers/recipe")

router.post('/add', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return addRecipe(req, res);
  });

  router.post('/search', async (req, res) => {
    if(!requestUtils.isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return responseUtils.badRequest(res, "Content was not Json");
    }
    return recipe.SearchRecipe(req, res);
  });

module.exports = router;