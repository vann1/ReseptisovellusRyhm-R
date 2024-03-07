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

module.exports = {addRecipe}