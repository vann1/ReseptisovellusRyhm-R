import React, { useEffect, useState } from 'react';

const ShowRecipe = () => {
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recipe/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeid: 173,
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
  }, []);

  return (
    <div>
      <h1>Recipe</h1>
      {searchResults.length > 0 && (
        <div>
          <ul>
            {searchResults.map((recipe) => (
              <li key={recipe.recipeid}>
                <strong>Recipe ID:</strong> {recipe.recipeid}<br />
                <strong>User ID:</strong> {recipe.userid}<br />
                <strong>Recipe Name:</strong> {recipe.recipename}<br />
                <strong>Category:</strong> {recipe.category}<br />
                <strong>Instructions:</strong> {recipe.instructions}<br />
                <strong>Description:</strong> {recipe.description}<br />
                <strong>Tags:</strong> {recipe.tags}<br />
                {recipe.images && (
                  <div>
                    <strong>Image:</strong><br />
                    <img src={`data:image/jpeg;base64,${recipe.images}`} alt="Recipe Image" style={{ maxWidth: '300px' }} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ShowRecipe;




