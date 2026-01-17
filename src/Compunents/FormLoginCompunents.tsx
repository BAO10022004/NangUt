import { Eye, EyeOff } from 'lucide-react';
import '../assets/LoginPage.css';
import { authenticateAccount } from '../services/AccountService';
import { auth } from '../main';
import { useNavigate } from 'react-router-dom';
import React from 'react';
import { LoadingForm } from './LoadingForm';
interface FormLoginCompunentProps {
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  showPassword: boolean;
  setShowPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: ReturnType<typeof useNavigate>;
}

function FormLoginCompunent({
  username,
  setUsername,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  setIsLoading,
  navigate
}: FormLoginCompunentProps) {
  //////////=================== Action Login ======================================== //////////
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);
    <LoadingForm message="Đang đăng nhập..." />
    try {
      const account = await authenticateAccount(username, password); 

      if (account) {
        auth.login(username);
        console.log('Login successful, redirecting...');
        navigate('/dashboard', { replace: true });

      } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      alert('Đăng nhập thất bại! Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
      
    }
  };

  return (
    <div className="login-form-wrapper">
      <h1 className="login-title">Đăng Nhập</h1>
      
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nhập username"
            disabled={isLoading}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập password"
              disabled={isLoading}
              required
            />
            <button
              type="button"
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          className="login-button"
          disabled={isLoading}
        >
          {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
}

export default FormLoginCompunent;