import React, { useEffect, useState } from 'react';
import '../styles/ClientStyles.css';

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
          recipeid: 174,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data.recipes.recordset); // Assuming the API returns an array of recipes
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
          {searchResults.map((recipe) => (
            <div key={recipe.recipeid} style={{ display: 'flex', marginBottom: '20px' }}>
              {recipe.images && (
                <div style={{ flex: 1, marginRight: '20px' }}>
                  <strong>Image:</strong><br />
                  <img src={`data:image/jpeg;base64,${recipe.images}`} alt="Recipe Image" style={{ maxWidth: '300px' }} />
                </div>
              )}
              <div style={{ flex: 2 }}>
                <p><strong>Recipe ID:</strong> {recipe.recipeid}</p>
                <p><strong>User ID:</strong> {recipe.userid}</p>
                <p><strong>Recipe Name:</strong> {recipe.recipename}</p>
                <p><strong>Category:</strong> {recipe.category}</p>
                <p><strong>Description:</strong> {recipe.description}</p>
                <p><strong>Tags:</strong> {recipe.tags}</p>
                <p><strong>Instructions:</strong> {recipe.instructions}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShowRecipe;





