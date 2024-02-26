import React, { useState, useEffect } from 'react';
import RegisterForm from '../components/RegisterForm';

const RegisterPage = () => {

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
        if (response.ok) {
          console.log('User created successfully', response.status);
        } else {
          throw new Error(data.error);
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