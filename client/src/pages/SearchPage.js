import React, { useEffect, useState } from 'react';

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
      <div>
        <label>Recipe id:</label>
        <input type="text" value={recipeid} onChange={(e) => setrecipeID(e.target.value)} />
      </div>
      <div>
        <label>Recipe Name:</label>
        <input type="text" value={recipeName} onChange={(e) => setrecipeName(e.target.value)} />
      </div>
      <div>
        <label>Category:</label>
        <input type="text" value={recipeCategory} onChange={(e) => setrecipeCategory(e.target.value)} />
      </div>
      <div>
        <label>Tags:</label>
        <input type="text" value={recipeTag} onChange={(e) => setrecipeTag(e.target.value)} />
      </div>
      <div>
        <label>Username:</label>
        <input type="text" value={recipeUsername} onChange={(e) => setrecipeUsername(e.target.value)} />
      </div>
      <div>
        <label>Name:</label>
        <input type="text" value={recipeownerName} onChange={(e) => setrecipeownerName(e.target.value)} />
      </div>
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
                <td>{recipe.recipename} - {recipe.category} - {recipe.username}</td>
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