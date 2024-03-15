const {badRequest, created, internalServerError, notFound, ok} = require('../utils/responseUtils')
const {addRecipeToDatabase, getRecipeFromDatabase, editRecipeToDatabase} = require('../database')

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
        const recipes = await getRecipeFromDatabase(req, res);

        if (!recipes || recipes.length === 0) {
            return notFound(res, "Recipe not found in the database");
        }

        return ok(res, "Search completed.", { recipes });

    } catch (error) {
        console.error("Error searching recipe: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};
const editRecipe = async (req,res) => {
    try {
        const recipes = await editRecipeToDatabase(req, res);
        if (!recipes || recipes.length === 0) {
            return notFound(res, "Couldnt edit recipe to database");
        }
        return ok(res, "Recipe edited successfully.");

    } catch (error) {
        return internalServerError(res, "Internal server error while searching for recipes");
    }
}

module.exports = {addRecipe, SearchRecipe, editRecipe}