import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import { useHotel } from '../../services/HotelContext';
import Navbar from '../../marketing/components/Navbar/Navbar';
import Footer from '../../marketing/components/Footer/Footer';
import './AdminLogin.css';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAsAdmin } = useAuth();
  const { hotelId, currentHotel } = useHotel();
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from a private route, ensure the redirect path is preserved
  const from = location.state?.from?.pathname || `/admin`;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await loginAsAdmin(credentials.username, credentials.password);
    
    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-page admin-login-theme">
      <Navbar forceSolid={true} />
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="management-badge">STAFF ACCESS</div>
            <h2>{currentHotel?.name} Portal</h2>
            <p>Secure administrative gateway for property management and reporting.</p>
          </div>
          
          {error && <div className="login-error-banner">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label>Manager Username</label>
              <input 
                type="text" 
                name="username" 
                placeholder="ID Number or Username" 
                value={credentials.username}
                onChange={handleChange}
                required 
              />
            </div>
            <div className="form-group">
              <label>Secure Password</label>
              <input 
                type="password" 
                name="password" 
                placeholder="••••••••" 
                value={credentials.password}
                onChange={handleChange}
                required 
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Validating Credentials...' : 'Authenticate'}
            </button>
          </form>
          
          <div className="login-footer-hint">
            <p>Standard Access: <code>admin / 123</code></p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminLogin;

