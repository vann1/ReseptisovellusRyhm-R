import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import {Link} from 'react-router-dom';
const ProfileForm = () => {
    const [userRecipes, setUserRecipes] = useState([]);
    const [userDetails, setUserDetails] = useState({});
    const {user} = useAuthContext();
    const [showInfo, setShowInfo] = useState(false)
    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/user/profile', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                  },
                  body: JSON.stringify({ email: user.email }),
                });
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.error);
                }
                if (response.ok) {
                    setUserDetails(data.data.userWithoutPassword)
                } 
              } catch (error) {
                console.error('Error:', error);
              }
        }
        getUserDetails();
        getUserRecipes();
    },[])

    const getUserRecipes = async () => {
      const userid = user.userid;
      try {
        const response = await fetch(`http://localhost:3001/api/user/profile/${userid}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        if (response.ok) {
            setUserRecipes(data.data.result);
            setShowInfo(true);
        } 
      } catch (error) {
        console.error('Error:', error);
      }
    }
    return (
        <div>
          {showInfo ? <div>
            <h1>{userDetails.username}</h1>
            <div>
              <table>
                <thead>
                  <tr>
                    <th>Omat Reseptit</th>
                  </tr>
                </thead>
                <tbody>
                {userRecipes.map((recipe, index) => (
                <tr key={index}>
                  <td>
                    <Link to={`/userrecipe/${recipe.recipeid}`}>
                      {recipe.recipename}
                    </Link>{" "}
                    - {recipe.category} - {recipe.username}
                  </td>
                </tr>
              ))}
                </tbody>
              </table>
            </div>
          </div>: <h1>Loading...</h1>}
        </div>
      );
}
export {ProfileForm}