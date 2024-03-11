import React, { useState, useEffect } from 'react';
import {ProfileForm} from '../components/ProfileForm';
import {useNavigate} from "react-router-dom"
const ProfilePage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <ProfileForm></ProfileForm>
    </div>
  );
};

export {ProfilePage} ;