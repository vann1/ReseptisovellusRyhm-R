import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const SearchPage = () => {
  const [recipeName, setrecipeName] = useState('');
  const [recipeCategory, setrecipeCategory] = useState('');
  const [recipeTag, setrecipeTag] = useState('');
  const [recipeUsername, setrecipeUsername] = useState('');
  const [recipeownerName, setrecipeownerName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipeid, setrecipeID] = useState('');

const getRecipeById = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recipe/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeid,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data.recipes.recordset); // Assuming the API returns an array of recipes
      console.log(data);
      console.log(searchResults);
    } catch (error) {
      console.error('Error during search:', error.message);
      setSearchResults([]);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recipe/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeid,
          recipeName,
          recipeCategory,
          recipeTag,
          recipeUsername,
          recipeownerName,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data.recipes.recordset); // Assuming the API returns an array of recipes
      console.log(data);
      console.log(searchResults);
    } catch (error) {
      console.error('Error during search:', error.message);
      setSearchResults([]);
    }
  };
useEffect(() => {
handleSearch();
},[])


  useEffect(() => {
    handleSearch();
  },[])
  return (
    <div>
      <h1>Recipe Search</h1>
      {/* Your existing input fields */}
      <button onClick={handleSearch}>Search</button>

      {searchResults.length > 0 && (
        <div>
          <table>
            <thead>
              <tr>
                <th>Resepti tulokset:</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((recipe, index) => (
                <tr key={index}>
                  {/* Modify this part to make the recipe name clickable */}
                  <td>
                    <Link to={`/Recipe/${recipe.recipeid}`}>
                      {recipe.recipename}
                    </Link>{" "}
                    - {recipe.category} - {recipe.username}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SearchPage;