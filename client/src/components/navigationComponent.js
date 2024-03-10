import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link, useActionData } from 'react-router-dom';
import '../styles/styles.css'

const Navigation = () => {
  return(
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/" className="navigation-link">Home</Link>
        </li>
        <li className="navigation-item">
          <Link to="/RegisterPage" className="navigation-link">Registration</Link>
        </li>
        <li className="navigation-item">
          <Link to="/LoginPage" className="navigation-link">Log in</Link>
        </li>
        <li className="navigation-item">
          <Link to="/NewRecipe" className="navigation-link">New recipe</Link>
        </li>
        <li className="navigation-item">
          <Link to="/SearchPage" className="navigation-link">Search</Link>
        </li>
      </ul>
    </nav>
  )
};
  

export  {Navigation};