const {internalServerError, notFound, ok} = require('../utils/responseUtils')
const {getIngredientsFromDatabase, addIngredientToDatabase} = require('../database')


const getIngredients = async (req, res) => {
    try {
        const ingredients = await getIngredientsFromDatabase(req, res);
        
        if (!ingredients || ingredients.length === 0) {
            return notFound(res, "Ingredients not found in the database");
        }
        return ok(res, "Ingredients found from database", { ingredients });

    } catch (error) {
        console.error("Error getting ingredients: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};

const addIngredient = async (req, res) => {
    try {
        console.log(req.body.updatedIngredients, "ASdasdas")
        const result = await addIngredientToDatabase(req, res);
        
        if (!result || result.length === 0) {
            return notFound(res, "Ingredients not found in the database");
        }
        return ok(res, "Ingredients found from database", { result });

    } catch (error) {
        console.error("Error getting ingredients: " + error);
        return internalServerError(res, "Internal server error while searching for recipes");
    }
};
module.exports = {getIngredients, addIngredient};