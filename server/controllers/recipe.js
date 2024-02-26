const responseUtils = require('../utils/responseUtils')
const database = require('../database')

const addRecipe = (req, res) => {
    try {
        if(!database.addRecipeToDatabase(req, res)) {
            responseUtils.badRequest(res, "Failed to add recipe to database.")
        }
        return responseUtils.created(res, "Recipe added to database successfully.")
    }catch(error) {
        console.error("Error adding user to database: " + error)
        return responseUtils.internalServerError(res, "Internal server error, while creating user");
    }
}

module.exports = {addRecipe}