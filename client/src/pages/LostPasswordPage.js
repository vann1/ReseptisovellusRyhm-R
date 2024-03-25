import React, { useState } from "react";
import LostPasswordForm from "../components/LostPasswordForm";

const LostPassword = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendReturnCode = async (email) => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:3001/api/email/recover", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setIsLoading(false);

      if (!response.ok) {
        setErrorMessage(data.error);
      } else {
        setSuccessMessage("Salasana palautettu onnistuneesti");
        // Optionally set a success message here
      }
    } catch (error) {
      console.error("Error sending password recovery email:", error);
      setErrorMessage("Virhe palautettaessa salasanaa");
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div>
      <h1>Palauta salasana</h1>
      <LostPasswordForm
        errorMessage={errorMessage}
        successMessage={successMessage}
        clearMessages={clearMessages}
        isLoading={isLoading}
        sendReturnCode={sendReturnCode}
      />
    </div>
  );
};

export default LostPassword;
