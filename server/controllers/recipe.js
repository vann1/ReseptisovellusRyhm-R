const {badRequest, created, internalServerError} = require('../utils/responseUtils')
const {addRecipeToDatabase} = require('../database')

const addRecipe = (req, res) => {
    try {
        if(!addRecipeToDatabase(req, res)) {
            badRequest(res, "Failed to add recipe to database.")
        }
        return created(res, "Recipe added to database successfully.")
    }catch(error) {
        console.error("Error adding user to database: " + error)
        return internalServerError(res, "Internal server error, while creating user");
    }
}

const SearchRecipe = async (req, res) => {
    try {
        const recipes = await database.getRecipeFromDatabase(req, res);

        if (!recipes || recipes.length === 0) {
            return responseUtils.notFound(res, "Recipe not found in the database");
        }

        console.log('Recipes: ', recipes);
        return responseUtils.ok(res, "Search completed.", { recipes });

    } catch (error) {
        console.error("Error searching recipe: " + error);
        return responseUtils.internalServerError(res, "Internal server error while searching for recipes");
    }
};

module.exports = {addRecipe, SearchRecipe}