import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useActionData } from 'react-router-dom';
import '../styles/styles.css'
import { useAuthContext } from "../hooks/useAuthContext";
import { ProfileButton } from './ProfileButton';
import { AdminButton } from '../components/AdminButton';
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
        <li className="navigation-item">
          <Link to="/NewRecipe" className="navigation-link">New recipe</Link>
        </li>
        <li className="navigation-item">
          <Link to="/SearchPage" className="navigation-link">Search</Link>
        </li>
        <li className="navigation-item">
          <Link to="/Recipe" className="navigation-link">Show Recipe</Link>
        </li>
      </ul>
    </div>
    {user && (<>
      <ProfileButton></ProfileButton>
        <button onClick={handleClick}>Log out</button>
        {user.role === 1  && (<><AdminButton></AdminButton></>)}</>)}
    
    </nav>
  )
};
  

export  {Navigation};