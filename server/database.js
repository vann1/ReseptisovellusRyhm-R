const {validateUser} = require('./utils/userUtils')
const {} = require('./utils/responseUtils')
const sql = require('mssql');
const config = require('./config/config')
const bcrypt = require('bcrypt'); // for password encrypting

/**
 * Adds a user to the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {boolean} Returns true if the user is successfully added to the database, otherwise false.
 */
const addUserToDatabase = async (req, res) => {
    //First it gets user details from req.body
    const { username, email, password ,name } = req.body;
    //Checks if those user details were in correct format
    if(!validateUser(username, email, password ,name)) {
        return false;
    }
    const existingUser = await getUserFromDatabase(req, res);
    //Checks if user already exists in the database
    if(existingUser !== undefined) {
        return false;
    }
    try {
        //creates connection to database
        await sql.connect(config);
        
        //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
        const request = new sql.Request();

        //encrypts password for database
        const hashedPassword = await bcrypt.hash(password, 10);
        //query for database
        const query = `
            INSERT INTO [dbo].[users] (username, email, password, name)
            VALUES (@username, @email, @password, @name)
        `;
        //database request
        await request
            .input('username', sql.NVarChar, username)
            .input('email', sql.NVarChar, email)
            .input('password', sql.NVarChar, hashedPassword)
            .input('name', sql.NVarChar, name)
            .query(query);

        return true;
    }
    catch(error) {
        console.error('Error adding user to the database:', error);
        return false;
    }
}

/**
 * Retrieves a user from the database based on the provided email.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {object|undefined} Returns the user object if found, otherwise returns undefined.
 */
const getUserFromDatabase = async (req, res) => {
    //takes email from req.body
    const { email } = req.body;
    try {
        //creates connection to database
        await sql.connect(config);

        //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
        const request = new sql.Request();

        //query for database
        const query = `SELECT * FROM users WHERE email = @email`;
        //make database request for email
        const result = await request
        .input('email', sql.NVarChar, email)
        .query(query);
        //checks if the user existed in the database
        if(result.recordset.length > 0){
            //returns that user
            const user = result.recordset[0];
            return user;
        }
        //else returns undefined, which means user didnt exist in the database
        return undefined;
    }
    catch(error) {
        console.error('Error getting user from the database:', error);
    }
}


const addRecipeToDatabase = async (req, res) => {
  const { UserID, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags, Ingredients, selectedFile } = req.body;
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();

    try {
      await transaction.begin();
      // Insert into recipes table
      const recipeQuery = `
      INSERT INTO [dbo].[recipes] (userid, recipename, category, instructions, description, tags${selectedFile ? ', images' : ''})
      VALUES (@Userid, @RecipeName, @RecipeCategory, @RecipeGuide, @RecipeDesc, @Tags${selectedFile ? ', @selectedFile' : ''});
      SELECT SCOPE_IDENTITY() AS RecipeID; -- Retrieve the newly inserted recipe ID
      `;
      const recipeResult = await new sql.Request(transaction)
        .input('Userid', sql.NVarChar, UserID)
        .input('RecipeName', sql.NVarChar, RecipeName)
        .input('RecipeCategory', sql.NVarChar, RecipeCategory)
        .input('RecipeGuide', sql.NVarChar, RecipeGuide)
        .input('RecipeDesc', sql.NVarChar, RecipeDesc)
        .input('Tags', sql.NVarChar, Tags)
        .input('selectedFile', sql.VarBinary, selectedFile ? Buffer.from(selectedFile, 'base64') : null)
        .query(recipeQuery);
      const recipeID = recipeResult.recordset[0].RecipeID;
      // Insert into ingredients table for each ingredient
      const ingredientQuery = `
        INSERT INTO [dbo].[ingredients] (recipeid, quantity, measure, ingredientname)
        VALUES (@RecipeID, @Quantity, @Measure, @IngredientName);
      `;
      for (let i = 0; i < Ingredients.length; i++) {
        const ingredient = Ingredients[i];
        await new sql.Request(transaction)
          .input('RecipeID', sql.Int, recipeID)
          .input('Quantity', sql.NVarChar, ingredient.IngAmount)
          .input('Measure', sql.NVarChar, ingredient.IngMeasure)
          .input('IngredientName', sql.NVarChar, ingredient.IngName)
          .query(ingredientQuery);
      }
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding recipe to the database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }
};

/********************************************************* */

const getRecipeFromDatabase = async (req, res) => {
  // Assuming your database connection is already established and stored in the 'sql' variable

  // Destructure parameters from the request body
  const { recipeName, recipeCategory, recipeTag, recipeUsername, recipeOwnerName } = req.body;

  try {
    // Initialize a new request object
    const request = new sql.Request();

    // Build the query based on the provided parameters
    let query = 'SELECT * FROM recipes WHERE 1=1'; // Start with a true condition

    if (recipeName) {
      query += ' AND recipename LIKE @recipeName';
      request.input('recipeName', sql.NVarChar, `%${recipeName}%`);
    }

    if (recipeCategory) {
      query += ' AND category LIKE @recipeCategory';
      request.input('recipeCategory', sql.NVarChar, `%${recipeCategory}%`);
    }

    if (recipeTag) {
      query += ' AND tags LIKE @recipeTag';
      request.input('recipeTag', sql.NVarChar, `%${recipeTag}%`);
    }

    if (recipeUsername) {
      query +=
        ' AND userid IN (SELECT userid FROM users WHERE username LIKE @recipeUsername)';
      request.input('recipeUsername', sql.NVarChar, `%${recipeUsername}%`);
    }

    if (recipeOwnerName) {
      query +=
        ' AND userid IN (SELECT userid FROM users WHERE name LIKE @recipeOwnerName)';
      request.input('recipeOwnerName', sql.NVarChar, `%${recipeOwnerName}%`);
    }
    
    // Execute the query
    const result = await request.query(query);

    console.log('SQL Query:', query);

    if (result.recordset.length > 0) {
      // Return the first record if any
      const recipes = result;
      console.log(recipes);
      return recipes;
    } else {
      return undefined;
    }
  } catch (error) {
    // Handle errors
    console.error(error);
    return undefined;
  }
};



  
module.exports = {addUserToDatabase, getUserFromDatabase, addRecipeToDatabase, getRecipeFromDatabase};