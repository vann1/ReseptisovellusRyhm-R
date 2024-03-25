
import { useState } from "react";
import '../styles/styles.css';

const LostPasswordForm = ({ errorMessage, isLoading }) => {
  const [email, setEmail] = useState('');
  
  const sendReturnCode = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/email/recover', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error);
      }
      
    } catch (error) {
      console.error('Error sending password recovery email:', error);
      // Set the error message in the parent component
    }
  }

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
      <p className="loginError">{errorMessage}</p>
      <button onClick={sendReturnCode} disabled={isLoading}>Palauta salasana</button>
    </div>
  );
};

export default LostPasswordForm;
