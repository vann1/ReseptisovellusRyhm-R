const express = require('express');
const sql = require('mssql');
const config = require('../config/config');
const {badRequest} = require("../utils/responseUtils")
const {isJson} = require('../utils/requestUtils')
const router = express.Router();
const {searchRecipes,addRecipe, SearchRecipe, editRecipe,deleteRecipe, deleteRecipeImage} = require("../controllers/recipe")
const {requireAuth} = require('../middlewares/authMiddleware')

//Etsii reseptejä tietokannasta.
router.post('/search', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return SearchRecipe(req, res);
});

//Etsii kaikki reseptit tietokannasta
router.post('/searchAll', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return searchRecipes(req, res);
})

router.use(requireAuth);
//after this all routes requires authenticated user
//Hakee reseptin tietokannasta id:een perusteella
router.get('/:id', async (req, res) => {
  if(!isJson) {
    //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
    return badRequest(res, "Content was not Json");
  }
  return SearchRecipe(req, res);
});

//Lisää reseptin tietokantaan
router.post('/add', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return addRecipe(req, res);
  });
//Muokkaa reseptiä tietokannassa
  router.put('/edit', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return editRecipe(req, res);
  });
//Poistaa reseptin tietokannasta
  router.delete('/:recipeId', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return deleteRecipe(req, res);
  });
  //Poistaa reseptin kuvan tietokannasta
  router.delete('/image/:recipeId', async (req, res) => {
    if(!isJson) {
      //If it wasn't, the responseUtils.badRequest function is returned, which takes res and an error message as parameters.
      return badRequest(res, "Content was not Json");
    }
    return deleteRecipeImage(req, res);
  });
module.exports = router;