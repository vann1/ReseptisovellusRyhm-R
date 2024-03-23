import React, { useState, useEffect } from 'react';
import {ProfileForm} from '../components/ProfileForm';
import { FavoritesComponent } from '../components/FavoritesComponent';

const ProfilePage = () => {

  


  return (
    <div>
      <ProfileForm></ProfileForm>
      <FavoritesComponent/>
    </div>
  );
};

export {ProfilePage} ;