import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../styles/ClientStyles.css';

const ShowRecipe = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState(''); // State to hold user's comment
  const { recipeId } = useParams();

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
      setSearchResults(data.data.recipes.recordset);
    } catch (error) {
      console.error('Error during search:', error.message);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [recipeId]);

  const handleRatingChange = (rating) => {
    setUserRating(rating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleSubmit = () => {
    // Here you can send the userRating and comment to your backend for processing or storage
    console.log('User Rating:', userRating);
    console.log('Comment:', comment);
  };

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

                <div>
                  <strong>Rate this recipe:</strong><br />
                  {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      key={index}
                      style={{ cursor: 'pointer', color: star <= userRating ? 'gold' : 'gray' }}
                      onClick={() => handleRatingChange(star)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>

                {/* Text box for comment */}
                <div style={{ marginTop: '10px' }}>
                  <textarea
                    rows="4"
                    cols="50"
                    placeholder="Leave a comment..."
                    value={comment}
                    onChange={handleCommentChange}
                  />
                </div>

                {/* Submit button */}
                <div style={{ marginTop: '10px' }}>
                  <button onClick={handleSubmit}>Send Rating</button>
                </div>
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











