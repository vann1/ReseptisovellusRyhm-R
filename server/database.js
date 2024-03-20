const { validateUser } = require("./utils/userUtils");
const {} = require("./utils/responseUtils");
const sql = require("mssql");
const config = require("./config/config");
const bcrypt = require("bcrypt"); // for password encrypting

/**
 * Adds a user to the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @returns {boolean} Returns true if the user is successfully added to the database, otherwise false.
 */
const addUserToDatabase = async (req, res) => {
  //First it gets user details from req.body
  const { username, email, password, name } = req.body;
  //Checks if those user details were in correct format
  if (!validateUser(username, email, password, name)) {
    return false;
  }
  const existingUser = await getUserFromDatabase(req, res);
  //Checks if user already exists in the database
  if (existingUser !== undefined) {
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
      .input("username", sql.NVarChar, username)
      .input("email", sql.NVarChar, email)
      .input("password", sql.NVarChar, hashedPassword)
      .input("name", sql.NVarChar, name)
      .query(query);

    return true;
  } catch (error) {
    console.error("Error adding user to the database:", error);
    return false;
  }
  finally {
    await sql.close(); 
    } 
};

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
      .input("email", sql.NVarChar, email)
      .query(query);
    //checks if the user existed in the database
    if (result.recordset.length > 0) {
      //returns that user
      const user = result.recordset[0];
      return user;
    }
    //else returns undefined, which means user didnt exist in the database
    return undefined;
  } catch (error) {
    console.error("Error getting user from the database:", error);
  }
  finally {
    await sql.close(); 
    } 
};

console.log("...")

const addRecipeToDatabase = async (req, res) => {
  const { UserID, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags, Ingredients, selectedFile, RecipeReg } = req.body;
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();

    try {
      await transaction.begin();
      // Insert into recipes table
      const recipeQuery = `
      INSERT INTO [dbo].[recipes] (userid, recipename, category, instructions, description, tags, regonly${selectedFile ? ', images' : ''})
      VALUES (@Userid, @RecipeName, @RecipeCategory, @RecipeGuide, @RecipeDesc, @Tags, @RecipeReg${selectedFile ? ', @selectedFile' : ''});
      SELECT SCOPE_IDENTITY() AS RecipeID; -- Retrieve the newly inserted recipe ID
    `;
      const recipeResult = await new sql.Request(transaction)
      .input('Userid', sql.NVarChar, UserID)
      .input('RecipeName', sql.NVarChar, RecipeName)
      .input('RecipeCategory', sql.NVarChar, RecipeCategory)
      .input('RecipeGuide', sql.NVarChar, RecipeGuide)
      .input('RecipeDesc', sql.NVarChar, RecipeDesc)
      .input('Tags', sql.NVarChar, Tags)
      .input('RecipeReg', sql.Int, RecipeReg)
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
  finally {
    await sql.close(); 
    } 
}; 
  
/********************************************************* */

const getRecipeFromDatabase = async (req, res) => {
  // Assuming your database connection is already established and stored in the 'sql' variable
  const recipeidparams = req.params.id;
  //userid for getting recipe for certain user
  const userid = req.params.userId;
  // Destructure parameters from the request body
  const { recipeName, recipeCategory, recipeTag, recipeUsername, recipeOwnerName, recipeid } = req.body;

  await sql.connect(config);
  try {
    // Initialize a new request object
    const request = new sql.Request();

    // Build the query based on the provided parameters
    let query = 'SELECT recipes.*, users.username, users.name FROM recipes INNER JOIN users ON recipes.userid = users.userid WHERE 1=1'; // Start with a true condition

    if (recipeName) {
      query += ' AND recipes.recipename LIKE @recipeName';
      request.input('recipeName', sql.NVarChar, `%${recipeName}%`);
    }
    
    if (recipeid) {
      query += ' AND recipes.recipeid LIKE @recipeid';
      request.input('recipeid', sql.NVarChar, `%${recipeid}%`);
    }

    if (recipeCategory) {
      query += ' AND recipes.category LIKE @recipeCategory';
      request.input('recipeCategory', sql.NVarChar, `%${recipeCategory}%`);
    }

    if (recipeTag) {
      query += ' AND recipes.tags LIKE @recipeTag';
      request.input('recipeTag', sql.NVarChar, `%${recipeTag}%`);
    }
 
    if (recipeUsername) {
      query += ' AND users.username LIKE @recipeUsername';
      request.input('recipeUsername', sql.NVarChar, `%${recipeUsername}%`);
    }

    if (recipeOwnerName) {
      query += ' AND users.name LIKE @recipeOwnerName';
      request.input('recipeOwnerName', sql.NVarChar, `%${recipeOwnerName}%`);
    }
    
    if (userid) {
      query +=
        ' AND users.userid = @userid';
      request.input('userid', sql.Int, userid);
    }

    if (recipeidparams) {
      query += ' AND recipeid LIKE @recipeid';
      request.input('recipeid', sql.NVarChar, `%${recipeidparams}%`);
    }
    
    // Execute the query
    const result = await request.query(query);



    if (result.recordset.length > 0) {
      // Return the first record if any
      const recipes = result.recordset;
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

const getAllUsersFromDatabase = async (req, res) => {
  try {
    await sql.connect(config);
    const request = new sql.Request();

    const query = `SELECT * FROM users`;

    const result = await request.query(query);

    if (result.recordset.length > 0) {
      const users = result.recordset;
      return users;
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error getting users from the database:", error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  finally {
    await sql.close(); 
    } 
};

const deleteUserFromDatabase = async (userid)  => {
  try {
    await sql.connect(config);
    const request = new sql.Request();
    const query = `DELETE FROM users WHERE userid = @userid`;

    const result = await request
      .input("userid", sql.NVarChar, userid)
      .query(query);
    return result;
  } catch (error) {
    console.error("Error deleting user from the database:", error);
    throw error;
  }
  finally {
    await sql.close(); 
    } 
};

const editRecipeToDatabase = async (req,res) => {

  const { id, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags, updatedIngredients, Ingredients, RecipeReg, selectedFile} = req.body;
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();

    try {
      await transaction.begin();
      const recipeUpdateQuery = `
      UPDATE [dbo].[recipes]
      SET recipename = @RecipeName,
          category = @RecipeCategory,
          instructions = @RecipeGuide,
          description = @RecipeDesc,
          tags = @Tags,
          regonly = @RecipeReg,
          images = @selectedFile
          WHERE recipeid = @RecipeID;
    `;
  await new sql.Request(transaction)
  .input('RecipeName', sql.NVarChar, RecipeName)
  .input('RecipeCategory', sql.NVarChar, RecipeCategory)
  .input('RecipeGuide', sql.NVarChar, RecipeGuide)
  .input('RecipeDesc', sql.NVarChar, RecipeDesc)
  .input('Tags', sql.NVarChar, Tags)
  .input('RecipeReg', sql.Int, RecipeReg)
  .input('RecipeID', sql.Int, id)
  .input('selectedFile', sql.VarBinary, selectedFile ? Buffer.from(selectedFile, 'base64') : null)
  .query(recipeUpdateQuery);

  const ingredientQuery = `
  UPDATE [dbo].[ingredients]
  SET quantity = @Quantity, measure = @Measure, ingredientname = @IngredientName
  WHERE recipeid = @RecipeID AND ingredientid = @IngredientID;
`;
for (let i = 0; i < updatedIngredients.length; i++) {
  const ingredient = updatedIngredients[i];
  await new sql.Request(transaction)
    .input('RecipeID', sql.Int, ingredient.recipeid)
    .input('Quantity', sql.Int, ingredient.IngAmount)
    .input('Measure', sql.NVarChar, ingredient.IngMeasure)
    .input('IngredientName', sql.NVarChar, ingredient.IngName)
    .input('IngredientID', sql.Int, ingredient.ingredientid)
    .query(ingredientQuery);
}

      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error updating recipe:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  } finally {
    await sql.close(); 
    } 
  }
  

const getIngredientsFromDatabase = async (req,res) => {
  const recipeid = req.params.recipeId;
  try {
    //creates connection to database
    await sql.connect(config);

    //initializes a new request object that is used to send SQL queries to the connected database using the sql module or library.
    const request = new sql.Request();

    //query for database
    const query = `SELECT * FROM ingredients WHERE recipeid = @recipeId`;
    const result = await request
      .input("recipeId", sql.Int, recipeid)
      .query(query);
    if (result.recordset.length > 0) {
      const ingredients = result.recordset;
      return ingredients;
    }
    return undefined;
  } catch (error) {
    console.error("Error getting ingredients from the database:", error);
  }  
}



const addIngredientToDatabase = async (req, res) => {
  const {Ingredients, id} = req.body;
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();

    try {
      await transaction.begin();
      const ingredientQuery = `
        INSERT INTO [dbo].[ingredients] (recipeid, quantity, measure, ingredientname)
        VALUES (@RecipeID, @Quantity, @Measure, @IngredientName);
      `;
        await new sql.Request(transaction)
          .input('RecipeID', sql.Int, id)
          .input('Quantity', sql.NVarChar, Ingredients[0].IngAmount)
          .input('Measure', sql.NVarChar, Ingredients[0].IngMeasure)
          .input('IngredientName', sql.NVarChar, Ingredients[0].IngName)
          .query(ingredientQuery);

      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      console.error('Error adding ingredient to the database:', error);
      return false;
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false;
  }  finally {
    await sql.close(); 
    } 
}; 


const deleteIngredientFromDatabase = async (req, res) => {
  const { ingredientId } = req.params; 
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();
    try {
      await transaction.begin();
      const deleteQuery = `
        DELETE FROM [dbo].[ingredients] WHERE ingredientid = @IngredientID;
      `;
      await new sql.Request(transaction)
        .input('IngredientID', sql.Int, ingredientId)
        .query(deleteQuery);
      
      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting ingredient from database:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  }
  finally {
    await sql.close(); 
    } 
}
const deleteRecipeFromDatabase = async (req, res) => {
  const { recipeId } = req.params; 
  try {
    await sql.connect(config);
    const transaction = new sql.Transaction();
    try {
      await transaction.begin();
      const deleteQuery = `
        DELETE FROM [dbo].[recipes] WHERE recipeid = @RecipeId;
      `;
      await new sql.Request(transaction)
        .input('RecipeId', sql.Int, recipeId)
        .query(deleteQuery);
      
      await transaction.commit();
      return true; 
    } catch (error) {
      await transaction.rollback();
      console.error('Error deleting recipe from database:', error);
      return false; 
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return false; 
  }
  finally {
    await sql.close(); 
    } 
}

const deleteRecipeImageFromDatabase = async (req, res) => {
  const { recipeId } = req.params; 
  try {
    const pool = await sql.connect(config);
    const deleteQuery = `
      UPDATE [dbo].[recipes] 
      SET images = NULL 
      WHERE recipeid = @RecipeId;
    `;
    const result = await pool.request()
      .input('RecipeId', sql.Int, recipeId)
      .query(deleteQuery);
      
    if (result.rowsAffected[0] > 0) {
      return true; // Image deletion successful
    } else {
      return false; // Recipe ID not found or no image associated
    }
  } catch (error) {
    console.error('Error deleting recipe image from database:', error);
    return false; // Error occurred during deletion
  } finally {
    sql.close();
  } 
}
  
module.exports = {deleteRecipeImageFromDatabase, deleteRecipeFromDatabase, deleteIngredientFromDatabase ,addIngredientToDatabase,
   addUserToDatabase, getUserFromDatabase, addRecipeToDatabase, getRecipeFromDatabase, getAllUsersFromDatabase, deleteUserFromDatabase,
    editRecipeToDatabase, getIngredientsFromDatabase};