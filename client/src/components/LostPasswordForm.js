import React, { useState } from "react";
import "../styles/styles.css";

const LostPasswordForm = ({ errorMessage, successMessage, clearMessages, isLoading, sendReturnCode }) => {
  const [email, setEmail] = useState("");

  const handleSendReturnCode = () => {
    clearMessages();
    sendReturnCode(email);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Sähköposti"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="regInput"
      />
      <br />
      <p>{errorMessage}</p>
      <p>{successMessage}</p>
      <button onClick={handleSendReturnCode} disabled={isLoading}>
        Palauta salasana
      </button>
    </div>
  );
};

export default LostPasswordForm;

