import { useEffect, useState } from "react";
import { useAuthContext } from "../hooks/useAuthContext";
import '../styles/styles.css'
const AdminForm = () => {
    const [usersList, setUsersList] = useState([]);
    const { user } = useAuthContext();
    const [errors, setErrors] = useState();
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
    },[usersList])

    const handleDeleteUser = async (userid, email, role) => {
        try {
            if(userid === user.userid) {
                throw new Error('Et voi poistaa itseäsi.');
            }
            if(role === 1) {
                throw new Error('Et voi poistaa toista adminia.');
            }
            const response = await fetch(`http://localhost:3001/api/user/${userid}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
              },
            });
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            if(response.ok){
                setErrors('Käyttäjä ' + email +  ' poistettiin onnistuneesti.')
                console.log('User deleted: ', email);
            }
          } catch (error) {
            setErrors(error.message)
            console.error('Error deleting user:', error.message);
          }
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {usersList.map((user, index) => (
                    <tr key={index}>
                        <td>{user.email}</td>
                        <td><button onClick={() => handleDeleteUser(user.userid, user.email, user.ROLE)}>Poista käyttäjä: {user.name}</button></td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <br></br>
            {errors && <p className="pError">{errors}</p>}
        </div>
      );
}
export {AdminForm}