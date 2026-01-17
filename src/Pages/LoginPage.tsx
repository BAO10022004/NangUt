import { useState } from 'react';
import '../assets/LoginPage.css';
import { useNavigate } from 'react-router-dom';
import FormLoginCompunent from '../Compunents/FormLoginCompunents';
export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="login-container">
      <div className="animated-box box-outer"></div>
      <div className="animated-box box-inner"></div>
      <FormLoginCompunent
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        navigate={navigate}
      />
      
    </div>
  );
}