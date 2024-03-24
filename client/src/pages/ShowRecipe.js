import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { RatingComponent } from '../components/ReviewComponent';
import { useAuthContext } from "../hooks/useAuthContext";



const ShowRecipe = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [reciverEmail, setReciverEmail] = useState('');
  const { recipeId } = useParams();
  const {user} = useAuthContext();
  const [localhostAddress, setLocalhostAddress] = useState('http://localhost:3000/Recipe/' + recipeId);
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


  const sendRecipeToEmail = async () => {
    console.log(localhostAddress, user.email, reciverEmail)
    try {
      const response = await fetch('http://localhost:3001/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipePageAddress: localhostAddress,
          senderEmail: user.email,
          reciverEmail: reciverEmail
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log("Resepti lähetetty sähköpostiin")
    } catch (error) {
      console.error('Error sending recipe to email:', error.message);
    }

  }

 
  return (
    <div className='app'>
      {searchResults.length > 0 && (
        <div>
          {searchResults.map((recipe) => (
            <div key={recipe.recipeid}>
              <div className='compartment-container'>
                <div className='compartment1'>
                  {recipe.images && (
                    <div>
                      <h1 className="recipenameshow ">{recipe.recipename}</h1>
                      {/* Convert Buffer object to base64 encoded string */}
                      <img className='recipeimage' src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image" style={{ maxWidth: '300px' }} />
                      <div className='email-form'>
                        <h3>Jaa resepti</h3>
                        <label>Sähköposti: </label>
                        <input className='email-input-field' type="text" onChange={(e) => setReciverEmail(e.target.value)}></input>
                        <button className="email-send-button" onClick={() => sendRecipeToEmail()}>Lähetä</button>
                      </div>
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











