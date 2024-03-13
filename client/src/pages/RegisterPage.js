import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';
import {useNavigate} from "react-router-dom"

const RegisterPage = () => {
  const navigate = useNavigate();
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
          navigate('/LoginPage');
        } 
      } catch (error) {
        console.error('Error:', error);
      }
  };

  return (
    <div>
      <h1>Rekisteröidy</h1>
      <RegisterForm onRegister={handleRegister} />
    </div>
  );
};

export {RegisterPage} ;