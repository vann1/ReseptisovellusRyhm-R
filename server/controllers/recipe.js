const {badRequest, created, internalServerError, notFound, ok} = require('../utils/responseUtils')
const {searchRecipesFromDatabase, addRecipeToDatabase, getRecipeFromDatabase, editRecipeToDatabase, deleteRecipeFromDatabase, deleteRecipeImageFromDatabase} = require('../database')

//Lisää reseptin tietokantaan
const addRecipe = async (req, res) => {
    try {
        const recipeID = await addRecipeToDatabase(req, res);
        return ok(res, "Recipe added to database successfully.", {recipeID})
    }catch(error) {
        console.error("Error adding recipe to database: " + error)
        return internalServerError(res, "Internal server error, while creating recipe");
    }
}

//Etsii reseptejä tietokannasta
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
//Muokkaa reseptie tietokannassa
const editRecipe = async (req,res) => {
    try {
        const recipes = await editRecipeToDatabase(req, res);
        if (!recipes || recipes.length === 0) {
            return notFound(res, "Couldnt edit recipe to database");
        }
        return ok(res, "Recipe edited successfully.");

    } catch (error) {
        return internalServerError(res, "Internal server error while editing recipes");
    }
}
//Poistaa reseptin tietokannasta
const deleteRecipe = async (req,res) => {
    try {
        const result = await deleteRecipeFromDatabase(req, res);
        if(!result) {
            return notFound(res, "Couldnt delete recipe from database")
        }
        return ok(res, "Recipe deleted successfully.");
    } catch (error) {
        return internalServerError(res, "Internal server error while deleting recipe")
    }
}
//Poistaa reseptin kuvan tietokannassa
const deleteRecipeImage = async (req,res) => {
    try {
        const result = await deleteRecipeImageFromDatabase(req, res);
        if(!result) {
            return notFound(res, "Couldnt delete recipe image from database")
        }
        return ok(res, "Recipe image deleted successfully.");
    } catch (error) {
        return internalServerError(res, "Internal server error while deleting recipe image")
    }
}

//Hakee reseptejä
const searchRecipes = async (req,res) => {
    try {
        const result = await searchRecipesFromDatabase(req, res);
        if(!result) {
            return notFound(res, "not ok")
        }
        return ok(res, "Its ok", {data: result});
    } catch (error) {
        return internalServerError(res, "Internal server error")
    }
}


module.exports = {searchRecipes,deleteRecipeImage, deleteRecipe,addRecipe, SearchRecipe, editRecipe}