import './App.css';
import React, { useState, useEffect } from 'react';
import {Route, Routes, Link, Navigate} from "react-router-dom"
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import {Navigation} from './components/navigationComponent';
import RuokaKategoria from './pages/UusiResepti';
import { HomePage } from './pages/homepage';
function App() {
  //Navigatio komponentti on vaan testausta varten, voi poistaa
  //localStorage.clear()
  return (
    <div>
      <Navigation/>
      <Routes>
        <Route path='/' element={<HomePage></HomePage>}></Route>
        <Route path='/NewRecipe' element={<RuokaKategoria></RuokaKategoria>}></Route>
        <Route path="/RegisterPage" element={<RegisterPage></RegisterPage>}></Route>
        <Route path="/LoginPage" element={<LoginPage></LoginPage>}></Route>
      </Routes>
    </div>
  );
}

export default App;
