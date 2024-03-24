require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sql = require("mssql");
const app = express();
const config = require("./config/config"); // Tietokantayhteysasetukset
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const ingredientsRoutes = require("./routes/ingredientsRoutes");
const reviewRoutes = require("./routes/reviewRoutes")
const emailRoutes = require("./routes/emailRoutes")
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());

// Connect to the database
sql.connect(config, (err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
  } else {
    console.log("Connected to the database");
  }
});
// app.get("*", checkUser);
//Configure route for request /api/user which uses middleware functions from userRoutes file
app.use("/api/user", userRoutes);
//Configure route for request /api/recipe which uses middleware functions from recipeRoutes file
app.use("/api/recipe", recipeRoutes);

app.use("/api/ingredients", ingredientsRoutes);

app.use("/api/review", reviewRoutes);

app.use("/api/email", emailRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
