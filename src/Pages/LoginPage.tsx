import  { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../assets/LoginPage.css';
import { authenticateAccount } from '../services/AccountService';
import { auth } from '../main';
export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    authenticateAccount(username, password)
        .then((account) => {
            if (account) {
                auth.login(account.username, 'user', ''); 
                window.location.href = '/#/dashboard';
            } else {
                alert('Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.');
            }   
        })
        .catch((error) => {
            console.error('Lỗi đăng nhập:', error);
            alert('Đăng nhập thất bại do lỗi hệ thống.');
        });
  };

  return (
    <div className="login-container">
      {/* Animated background boxes */}
      <div className="animated-box box-outer"></div>
      <div className="animated-box box-inner"></div>
      
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
                required
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-button">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}