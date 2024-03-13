import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
const ProfileForm = () => {

    const [userDetails, setUserDetails] = useState({});
    const {user} = useAuthContext();
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
    },[])

    return (
        <div>
            <h1>Profiili</h1>
            <p>{userDetails.username}</p>
            <p>{userDetails.name}</p>
            <p>{userDetails.email}</p>
        </div>
      );
}
export {ProfileForm}