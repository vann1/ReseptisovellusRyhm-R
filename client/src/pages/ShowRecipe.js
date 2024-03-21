import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RatingComponent } from '../components/RecipeRating';
import { useAuthContext } from "../hooks/useAuthContext";



const ShowRecipe = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [recipeReviews, setRecipeReviews] = useState([]);
  const { recipeId } = useParams();
  const {user} = useAuthContext();
  const hasReviewed = recipeReviews.some(review => review.userid === user.userid);

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

    try {
      const response = await fetch('http://localhost:3001/api/review/search', {
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
      setRecipeReviews(data.data.reviews);
    } catch (error) {
      console.error('Error during reviewsearch:', error.message);
      setRecipeReviews([]);
    } 

  };

  useEffect(() => {
    handleSearch();
  }, [recipeId]);

 
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
                  {/* Convert Buffer object to base64 encoded string */}
                  <img src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image" style={{ maxWidth: '300px' }} />
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

                {!hasReviewed && <RatingComponent userid={user.userid} recipeid={recipe.recipeid} />}
                

                {recipeReviews.map(review => (
                  <div key={review.reviewid}>
                    <p>User ID: {review.userid}</p>
                    <p>Rating: {review.rating}</p>
                    {/* You can render more details of the review here */}
                  </div>
                ))}
                
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











