const express = require('express');
const sql = require('mssql');
const config = require('../config/config');
const responseUtils = require("../utils/responseUtils")

const router = express.Router();

router.post('/add', async (req, res) => {
    const { UserID, RecipeName, RecipeCategory, RecipeGuide, RecipeDesc, Tags } = req.body;
    try {
      await sql.connect(config);
      const request = new sql.Request();
      
      const query = `
        INSERT INTO [dbo].[recipes] (userid, recipename, category, instructions, description, tags)
        VALUES (@Userid, @RecipeName, @RecipeCategory, @RecipeGuide, @RecipeDesc, @Tags)
      `;
      await request
        .input('Userid', sql.NVarChar, UserID)
        .input('RecipeName', sql.NVarChar, RecipeName)
        .input('RecipeCategory', sql.NVarChar, RecipeCategory)
        .input('RecipeGuide', sql.NVarChar, RecipeGuide)
        .input('RecipeDesc', sql.NVarChar, RecipeDesc)
        .input('Tags', sql.NVarChar, Tags)
        .query(query);
      res.status(201).send('Recipe added successfully');
    } catch (error) {
      console.error('Error adding recipe to the database:', error);
      res.status(500).send('Internal Server Error');
    } finally {
      sql.close();
    }
  });

module.exports = router;