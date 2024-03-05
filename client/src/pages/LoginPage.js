import React, { useEffect, useState,  } from 'react';
import LoginForm from '../components/LoginForm';
//testiwqeqw
const LoginPage = () => {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [virheViesti, setVirheViesti] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    console.log(token)
    const fetchData = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:3001/api/user/jwt', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
          });
  
          if (response.ok) {
            const data = await response.json();
            console.log(data);
            setIsLoggedIn(true);
          } else {
            // Handle non-successful response (e.g., show an error message)
            console.error('Response not okay:', response);
          }
        } catch (error) {
          // Handle fetch error
          console.error('Fetch error:', error);
        }
      }
    };
  
    fetchData(); // Invoke the async function
  
  }, [token, setIsLoggedIn]);

  const handleLogin = async (email, password) => {
    setVirheViesti('');
    try {
      const response = await fetch('http://localhost:3001/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email, password}),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('jwt', data.data.token);
      }
      else {
        setVirheViesti("Käyttäjätunnus tai salasana väärä");
        throw new Error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
};
  return(
    <div>
      <h1>Kirjaudu</h1>
      <LoginForm virheViesti={virheViesti} onLogin={handleLogin}></LoginForm >
    </div>
  )
}

export {LoginPage};
