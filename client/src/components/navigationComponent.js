import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useActionData } from 'react-router-dom';
import '../styles/styles.css'
import { useAuthContext } from "../hooks/useAuthContext";
const Navigation = (props) => {
  const {dispatch, user} = useAuthContext()
  
  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user');

    dispatch({type: 'LOGOUT'})
  }

  const handleClick = () => {
    logout();
  }


  return(
    <nav className="navigation">
    <div>
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        {!user && (<><li className="navigation-item">
          <Link to="/RegisterPage" className="navigation-link">Registration</Link>
        </li>
        <li className="navigation-item">
          <Link to="/LoginPage" className="navigation-link">Log in</Link>
        </li>
        </>)}
        {user && (
        <li className="navigation-item">
          <Link to="/NewRecipe" className="navigation-link">New recipe</Link>
        </li>
        )}
      </ul>
    </div>
    {user && (<div>
      <span>{user.email}</span>
        <button onClick={handleClick}>Log out</button>
    </div>)}
    </nav>
  )
};
  

export  {Navigation};