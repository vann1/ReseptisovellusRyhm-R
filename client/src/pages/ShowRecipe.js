import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RatingComponent } from '../components/ReviewComponent';
import { useAuthContext } from "../hooks/useAuthContext";



const ShowRecipe = () => {
  const [searchResults, setSearchResults] = useState([]);
  const { recipeId } = useParams();
  const {user} = useAuthContext();

  const handleSearch = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/recipe/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipeid: recipeId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setSearchResults(data.data.recipes);
    } catch (error) {
      console.error('Error during search:', error.message);
      setSearchResults([]);
    }

 

  };

  useEffect(() => {
    handleSearch();
  }, [recipeId]);

 
  return (
    <div className='app'>
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((recipe) => (
            <div key={recipe.recipeid}>
              <div className='compartment-container'>
                <div className='compartment1'>
                  {recipe.images ? (
                    <div>
                      <h1 className="recipenameshow ">{recipe.recipename}</h1>
                      {/* Convert Buffer object to base64 encoded string */}
                      <img className='recipeimage' src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image" style={{ maxWidth: '300px' }} />
                    </div>
                  ):(
                    <div>
                      <h1 className="recipenameshow ">{recipe.recipename}</h1>
                    </div>
                  )}
                </div>
                <div className='compartment2'>
                  <p><strong>Category:</strong> {recipe.category}</p>
                  <p><strong>Description:</strong> {recipe.description}</p>
                  <p><strong>Tags:</strong> {recipe.tags}</p>
                  <p><strong>Instructions:</strong> {recipe.instructions}</p>
                </div>  
              </div>
              <div className='compartment3'>
              {user ? (
                <RatingComponent userid={user.userid} recipeid={recipe.recipeid} />
              ) : (
                <RatingComponent recipeid={recipe.recipeid}/>
              )}
                                  
              </div>           
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
};

// Function to convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

export default ShowRecipe;











