import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import {useNavigate, Link} from "react-router-dom"
import '../styles/styles.css'
const RegisterPage = () => {
  const navigate = useNavigate();
  const [signinsuccess, setSigninsuccess] = useState(false);
  const handleRegister = async (name, password, email, username) => {
      try {
        const response = await fetch('http://localhost:3001/api/user/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({username, email, password ,name}),
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error);
        }
        if (response.ok) {
          console.log('User created successfully', response.status);
          setSigninsuccess(true);
        } 
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div>
      {signinsuccess ? 
      <div className='Register-container'>
      <h1>Rekisteröityminen onnistui! Voit nyt kirjautua<Link to="/LoginPage"  className='Register-success-message'> tästä linkistä.</Link></h1>
      </div>:
      <div className='Register-container'>
      <RegisterForm onRegister={handleRegister} />
      </div>}
    </div>
  );
};

export {RegisterPage} ;