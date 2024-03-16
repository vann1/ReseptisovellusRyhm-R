const express = require('express');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const sql = require('mssql');
const config = require('../config/config');
const router = express.Router();
const {getIngredients, addIngredient} = require("../controllers/ingredients")
const {requireAuth} = require('../middlewares/authMiddleware')

router.use(requireAuth);
router.get('/:recipeId', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return getIngredients(req, res);
});
router.post('/add', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return addIngredient(req, res);
});








module.exports = router;