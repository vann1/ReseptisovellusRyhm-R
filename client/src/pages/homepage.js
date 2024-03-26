import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const HomePage = () => {
    const [input, setInput] = useState('');
    const [userfavorites, setuserfavorites] = useState([]);
    

    const searchRecipes = async () => {
        console.log(input);
        try {
            const response = await fetch("http://localhost:3001/api/recipe/searchAll", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ input }),
            });
            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.error);
            } 
            
            if (response.ok) {
                setuserfavorites(data.data.data);
                console.log(data.data);
            } 
          } catch (error) {
            console.error("Error:", error);
          }
    }

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };


    return(
        <div className="container-home">
            <div className="homepage-top">
                <h1>Resepti haku</h1>
                <div className="homepage-search">
                    <input type="text" className="home-search-input" placeholder="Etsi..." onChange={(e) => setInput(e.target.value)}></input><button onClick={() => searchRecipes()} className="home-search-button">Hae</button>
                </div>
            </div>
            {userfavorites.length > 0 && (
        <div>
          <table >
            <thead  className='reciperesult-thead'>
              <tr>
                <th style={{fontSize : '34px'}}>Haku tulokset</th>
              </tr>
            </thead>
            <tbody>
              {userfavorites.map((recipe, index) => (
                <tr key={index} className='favoritereciperow'>
                    <td>
                      <div className='search-flex'>
                    <div className='search-top'>
                      <div className='search-top-column'>
                      <Link className='recipename' to={`/Recipe/${recipe.recipeid}`}>
                        <p className='border4name'></p><h2 >Resepti nimi: {recipe.recipename}</h2>
                      </Link>{" "}
                      <p className='recipecategory'><strong>Kategoria: </strong><br/>{recipe.category}</p>
                      <p><strong>Kuvaus: </strong><br/>{recipe.description}</p>
                      </div>
                      <div className='favoritesearch-image'>
                      {recipe.images ?
                          <img   className='recipeimage'  src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image"/> :
                          <img   className='alterimage' src="/pics/noimage.png" alt="No Image"/>}
                      </div>
                      </div>
                      <div className='search-bottom' style={{marginTop : '1%'}}>
                      
                      </div>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

        </div>
    )
  };
    
  
  export  {HomePage};