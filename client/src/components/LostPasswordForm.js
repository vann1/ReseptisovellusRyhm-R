import React, { useState } from "react";
import "../styles/styles.css";

const LostPasswordForm = ({ errorMessage, successMessage, clearMessages, isLoading, sendReturnCode }) => {
  const [email, setEmail] = useState("");

  const handleSendReturnCode = () => {
    clearMessages();
    sendReturnCode(email);
  };

  return (
    <div className='Login-form'>
    <div>
      <div className='Register-h1'><h1>Palauta salasana</h1></div>
    <div className='login-inputs'>
      <input
        type="text"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="regInput"
      />
      <p>{errorMessage}</p>
      <p>{successMessage}</p>
      </div>
      <button  className="Register-button" onClick={handleSendReturnCode} disabled={isLoading}>
        Palauta salasana
      </button>
      </div>
    </div>
  );
};

export default LostPasswordForm;

