import { useState } from "react";
import '../styles/styles.css';

const LostPasswordForm = ({ onLogin, virheViesti, isLoading }) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [showForm, setShowForm] = useState(true);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  
  const sendReturnCode = () => {
    // Here you would typically send a reset code to the user's email
    // For demonstration purposes, let's just show the success message
    setShowForm(false);
    setShowSuccessMessage(true);
  }

  return (
    <div>
      {showForm && (
        <div>
          <input
            type="text"
            placeholder="Sähköposti"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="regInput"
          />
          <br />
          <p className="loginError">{virheViesti}</p>
          <button onClick={sendReturnCode} disabled={isLoading}>Palauta salasana</button>
          <br />
        </div>
      )}
      {showSuccessMessage && (
        <p>Palautuskoodi lähetetty</p>
      )}
    </div>
  );
};

export default LostPasswordForm;
