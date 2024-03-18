import { useState , useContext} from "react";
import { Link } from 'react-router-dom';
import '../styles/styles.css'
const LoginForm = ({onLogin, virheViesti, isLoading}) => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessages, setErrorMessages] = useState('');
  const handleLogin = () => {
    setErrorMessages('')
    onLogin(email, password);
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
      <br></br>
       <input
        type="password"
        placeholder="Salasana"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="regInput"
      />
      <br></br>
      <p className="loginError">{virheViesti}</p>
      <button onClick={handleLogin} disabled={isLoading}>Kirjaudu</button>'
      <br></br>
      <Link to={`/Password`}><p>Unohtuiko salasana?</p></Link>
    </div>
  );
};

export default LoginForm;