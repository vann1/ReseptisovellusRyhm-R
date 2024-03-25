import React, { useState } from "react";
import LostPasswordForm from "../components/LostPasswordForm";

const LostPassword = () => { 
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <h1>Palauta salasana</h1>
      <LostPasswordForm errorMessage={errorMessage} isLoading={isLoading} />
    </div>
  );
}

export default LostPassword;