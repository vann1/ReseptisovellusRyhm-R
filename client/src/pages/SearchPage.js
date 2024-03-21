import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/styles.css'

const SearchPage = () => {
  const [recipeName, setrecipeName] = useState('');
  const [recipeCategory, setrecipeCategory] = useState('');
  const [recipeTag, setrecipeTag] = useState('');
  const [recipeUsername, setrecipeUsername] = useState('');
  const [recipeownerName, setrecipeownerName] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recipeid, setrecipeID] = useState('');
  const {user} = useAuthContext();

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
  
      // Check if the user is logged in
      const isLoggedIn = user;
      // Filter recipes based on user login status and regonly value (0 or null)
      const filteredRecipes = data.data.recipes.filter(recipe => {
        if (isLoggedIn) {
          // For logged-in users, include all recipes
          return true;
        } else {
          // For non-logged-in users, include recipes with regonly 0 or null
          return recipe.regonly === 0 || recipe.regonly === null;
        }
      });
      setSearchResults(filteredRecipes);
  
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
    <div className='container-search'>
      <h1 className='h1-reseptihaku'>Resepti haku</h1>
      <form className='searchform'>
          {/* <div>
            <label>Resepti id:</label>
            <input type="text" value={recipeid} onChange={(e) => setrecipeID(e.target.value)} />
          </div> */}
          <div className='search'>
            <div className='search-option'>
              <label>Resepti nimi:</label>
              <br></br>
              <input type="text" value={recipeName} onChange={(e) => setrecipeName(e.target.value)} />
            </div>
            <div className='search-option'>
              <label>Kategoria:</label>
              <br></br>
              <input type="text" value={recipeCategory} onChange={(e) => setrecipeCategory(e.target.value)} />
            </div>
            <div className='search-option'>
              <label>Tagi:</label>
              <br></br>
              <input type="text" value={recipeTag} onChange={(e) => setrecipeTag(e.target.value)} />
            </div>
            <div className='search-option'>
              <label>Nimimerkki:</label>
              <br></br>
              <input type="text" value={recipeUsername} onChange={(e) => setrecipeUsername(e.target.value)} />
            </div>
          </div>
          {/* <div>
            <label>Käyttäjänimi:</label>
            <input type="text" value={recipeownerName} onChange={(e) => setrecipeownerName(e.target.value)} />
          </div> */}
            <button className='searchbutton' onClick={handleSearch}>Hae</button>
      </form>
      {searchResults.length > 0 && (
        <div className='reciperesults'>
          <table>
            <thead>
              <tr>
                <th>Resepti tulokset:</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((recipe, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/Recipe/${recipe.recipeid}`}>
                      {recipe.recipename}
                    - {recipe.category} - {recipe.username}
                    </Link>{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}</div>
  );
};

// const handleSearch = async () => {
//   try {
//     const response = await fetch('http://localhost:3001/api/recipe/search', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         recipeid,
//         recipeName,
//         recipeCategory,
//         recipeTag,
//         recipeUsername,
//         recipeownerName,
//       }),
//     });
    
//     if (!response.ok) {
//       throw new Error(`HTTP error! Status: ${response.status}`);
//     }

//     const data = await response.json();
//     setSearchResults(data.data.recipes.recordset); // Assuming the API returns an array of recipes
//     console.log(data);
//     console.log(searchResults);
//   } catch (error) {
//     console.error('Error during search:', error.message);
//     setSearchResults([]);
//   }
// };
export default SearchPage;