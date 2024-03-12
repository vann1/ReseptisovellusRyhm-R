import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";

const AdminForm = () => {
    const [usersList, setUsersList] = useState([]);
    const { user } = useAuthContext();
    useEffect(() => {
        const getAllUsers = async () => {
            try {
                const response = await fetch("http://localhost:3001/api/user/admin", {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${user.token}`
                  },
                });
                const data = await response.json();
                if (!response.ok) {
                  throw new Error(data.error);
                } 
                if (response.ok) {
                    setUsersList(data.data.users)
                } 
              } catch (error) {
                console.error("Error:", error);
              }
        }
        getAllUsers();
    },[])

    const handleDeleteUser = async () => {
        try {
            const response = await fetch(`http://localhost:3001/api/user/${userId}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                // Lisää tarvittaessa muita otsikoita, kuten esimerkiksi autentikaatioon liittyviä otsikoita
              },
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            const data = await response.json();
            console.log('User deleted:', data);
          } catch (error) {
            console.error('Error deleting user:', error.message);
          }
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map((user, index) => (
                    <tr key={index}>
                        <td>{user.email}</td>
                        <button onClick={() => {}}>Poista käyttäjä: {user.name}</button>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
      );
}
export {AdminForm}