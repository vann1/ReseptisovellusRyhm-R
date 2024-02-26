require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sql = require('mssql');
const app = express();
const config = require('./config/config'); // Tietokantayhteysasetukset
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');

app.use(cors());// Enable CORS for all routes
app.use(bodyParser.json());

// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});


app.use("/api/user", userRoutes);
app.use("/api/recipe", recipeRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});