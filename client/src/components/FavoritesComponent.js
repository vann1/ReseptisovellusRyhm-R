import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import { Link } from 'react-router-dom';


const FavoritesComponent = () => {
    const {user} = useAuthContext();
    const [userid, setuserid] = useState('');
    const [userfavorites, setuserfavorites] = useState([]);
    const [showInfo, setShowInfo] = useState(false)


    const SearchReviews = async () => {
        setuserid(user.userid);
        try {
          const response = await fetch(`http://localhost:3001/api/review/favorites/${userid}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            }
          });
        const data = await response.json();
          if (response.ok) {
            setShowInfo(true);
            setuserfavorites(data.data.reviews);
          } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          
        } catch (error) {
          console.error('Error during reviewsearch:', error.message);
          setuserfavorites([]);
        } 
            
       
      };

      const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
      };

    useEffect(() => {
        
        SearchReviews();
    }, [])



  

    return (
      <div>
        {showInfo ? <div>

        {userfavorites.length > 0 && (
        <div className='reciperesults'>
          <table >
            <thead  className='reciperesult-thead'>
              <tr>
                <th>Sinun suosikkisi</th>
              </tr>
            </thead>
            <tbody>
              {userfavorites.map((recipe, index) => (
                <tr key={index} className='reciperow'>
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
                      <div className='search-image'>
                      {recipe.images ?
                          <img   className='recipeimage'  src={`data:image/jpeg;base64,${arrayBufferToBase64(recipe.images.data)}`} alt="Recipe Image"/> :
                          <img   className='alterimage' src="/pics/noimage.png" alt="No Image"/>}
                      </div>
                      </div>
                      <div className='search-bottom' style={{marginTop : '1%'}}>
                      <h4 className='recipedesctiptiontitle'>Arvostelusi: </h4>
                      <div style={{marginTop :'1%'}}>
                      {[1, 2, 3, 4, 5].map((star, index) => (
                    <span
                      id="stars"
                      key={index}
                      style={{ color: star <= recipe.rating ? '#ff9100' : 'gray' }}
                    >
                      &#9733;
                    </span>
                  ))}</div>
                      <p className='recipedesctiption'>{recipe.review}</p>
                      </div>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

</div>: <h1>Ladataan...</h1>}
        </div>
      );
}

export {FavoritesComponent};