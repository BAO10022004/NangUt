import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '../assets/LoginPage.css';
import { authenticateAccount } from '../services/AccountService';
import { auth } from '../main';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!username.trim() || !password.trim()) {
      alert('Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    setIsLoading(true);

    try {
      console.log('Attempting login with:', username); // Debug log
      
      const account = await authenticateAccount(username, password);
      
      console.log('Authentication result:', account); // Debug log
      
      if (account) {
        // Đăng nhập thành công
        auth.login(username);
        
        console.log('Login successful, redirecting...'); // Debug log
        
        // Chuyển hướng đến dashboard
        navigate('/dashboard', { replace: true });
      } else {
        alert('Tên đăng nhập hoặc mật khẩu không chính xác!');
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
      alert('Đăng nhập thất bại! Vui lòng thử lại.');
    } finally {
      setIsLoading(false);
    }
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
    </div>
  );
}