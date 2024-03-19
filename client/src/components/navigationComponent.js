import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import '../styles/styles.css'
import { useAuthContext } from "../hooks/useAuthContext";
import { ProfileButton } from './ProfileButton';
import { AdminButton } from '../components/AdminButton';
const Navigation = (props) => {
  const {dispatch, user} = useAuthContext()
  const [isOpen, setIsOpen] = useState(false);
  const logout = () => {
    // remove user from storage
    localStorage.removeItem('user');

    dispatch({type: 'LOGOUT'})
  }

  const handleClick = () => {
    logout();
  }

  const toggleMenu = () => {
    setIsOpen((open) => !open);
  }

  return(
    <nav className="navigation">
        <Link to="/" className="home"></Link>
    <button className='trigger' onClick={toggleMenu}></button>
      <ul className={`navigation-list ${isOpen ? 'is-open' : ""}`}>
        <li className="navigation-item">
          <Link to="/" className="navigation-link" id="home"></Link>
        </li>
        <li className="navigation-item">
            <Link to="/ProfilePage" className="navigation-link">Oma profiili</Link>
        </li>
        <li className="navigation-item navright">
          <Link to="/SearchPage" className="navigation-link">Haku</Link>
        </li>
        {!user && (<div><li className="navigation-item ">
          <Link to="/RegisterPage" className="navigation-link">Rekisteröidy</Link>
        </li>
        <li className="navigation-item">
          <Link to="/LoginPage" className="navigation-link">Kirjaudu</Link>
        </li>
        </div>)}
          {user && (<>
        <li className="navigation-item">
            <Link to="/NewRecipe" className="navigation-link">Uusi resepti</Link>
          </li>
          {user.role === 1  && (<div><Link to="/AdminPage" className="navigation-link">Ylläpito</Link></div>)}
          <button className='logout' onClick={handleClick}>Kirjaudu ulos</button></>)}
      </ul>
    </nav>
  )
};
  

export  {Navigation};