import React, { useState } from 'react';
import { useAuth } from '../../../services/AuthContext';
import { RiPhoneLine, RiLockPasswordLine, RiUserLine, RiArrowRightSLine } from 'react-icons/ri';

const AuthModal = ({ isOpen, onSuccess }) => {
  const { loginWithPhone, verifyOTP, completeSignup } = useAuth();
  
  const [isSignUp, setIsSignUp] = useState(false);
  const [step, setStep] = useState(1); // 1: Initial, 2: OTP
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleInitialSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return setError('Please enter a phone number');
    if (isSignUp && !name) return setError('Please enter your full name');
    
    setLoading(true);
    setError('');
    
    try {
      await loginWithPhone(phone);
      setStep(2);
    } catch (err) {
      setError('Failed to send OTP. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP');
    setLoading(true);
    setError('');
    
    try {
      // Pass mode ('login' or 'signup') and name (for signup) to backend
      const mode = isSignUp ? 'signup' : 'login';
      const res = await verifyOTP(phone, otp, mode, name);
      if (res.success) {
        if (onSuccess) onSuccess();
      } else {
        setError(res.message);
      }
    } catch (err) {
      console.error('[AuthModal] Verification Error:', err);
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setStep(1);
    setOtp('');
  };

  return (
    <>
      <style>{`
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .auth-modal-content {
          background: #ffffff;
          width: 90%;
          max-width: 420px;
          border-radius: 24px;
          padding: 40px;
          position: relative;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          color: #1a1a1a;
          text-align: left;
        }
        .auth-modal-header h2 {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          margin-bottom: 8px;
          color: #1a1a1a;
          font-weight: 700;
        }
        .auth-modal-header p {
          color: #64748b;
          font-size: 15px;
          margin-bottom: 30px;
          line-height: 1.5;
        }
        .auth-error-msg {
          background: #fff5f5;
          color: #c53030;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13px;
          margin-bottom: 24px;
          border-left: 4px solid #c53030;
          font-weight: 500;
        }
        .auth-input-group {
          position: relative;
          margin-bottom: 16px;
        }
        .auth-input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 20px;
        }
        .auth-input-group input {
          width: 100%;
          padding: 16px 16px 16px 52px;
          border: 2px solid #f1f5f9;
          border-radius: 14px;
          font-size: 16px;
          outline: none;
          background: #f8fafc;
          transition: all 0.2s;
          color: #1e293b;
        }
        .auth-input-group input:focus {
          border-color: #1a1a1a;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
        }
        .auth-submit-btn {
          width: 100%;
          padding: 16px;
          background: #1a1a1a;
          color: #ffffff;
          border: none;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.2s;
          margin-top: 10px;
        }
        .auth-submit-btn:hover {
          background: #000;
          transform: translateY(-1px);
        }
        .auth-submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }
        .auth-toggle-box {
          margin-top: 24px;
          text-align: center;
          font-size: 14px;
          color: #64748b;
        }
        .auth-toggle-btn {
          background: none;
          border: none;
          color: #1a1a1a;
          font-weight: 700;
          cursor: pointer;
          margin-left: 5px;
          text-decoration: underline;
        }
        .auth-back-link {
          display: block;
          width: 100%;
          text-align: center;
          margin-top: 20px;
          background: none;
          border: none;
          color: #64748b;
          font-size: 13px;
          cursor: pointer;
        }
        .auth-modal-footer {
          margin-top: 32px;
          text-align: center;
          border-top: 1px solid #f1f5f9;
          padding-top: 20px;
          font-size: 12px;
          color: #94a3b8;
        }
      `}</style>

      <div className="auth-modal-overlay">
        <div className="auth-modal-content">
          <div className="auth-modal-header">
            <h2>{step === 2 ? 'Verification' : isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
            <p>
              {step === 1 && (isSignUp 
                ? 'Regsiter with your name and phone number to continue' 
                : 'Enter your phone number to sign in to your account')}
              {step === 2 && `Enter the 4-digit OTP sent to ${phone}`}
            </p>
          </div>

          {error && <div className="auth-error-msg">{error}</div>}

          {step === 1 ? (
            <form onSubmit={handleInitialSubmit}>
              {isSignUp && (
                <div className="auth-input-group">
                  <RiUserLine className="auth-input-icon" />
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoFocus
                  />
                </div>
              )}
              <div className="auth-input-group">
                <RiPhoneLine className="auth-input-icon" />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  autoFocus={!isSignUp}
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Sending...' : 'Send OTP'} <RiArrowRightSLine />
              </button>
              
              <div className="auth-toggle-box">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}
                <button type="button" className="auth-toggle-btn" onClick={toggleMode}>
                  {isSignUp ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP}>
              <div className="auth-input-group">
                <RiLockPasswordLine className="auth-input-icon" />
                <input 
                  type="text" 
                  placeholder="Enter 1234" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={4}
                  required
                  autoFocus
                />
              </div>
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'} <RiArrowRightSLine />
              </button>
              <button 
                type="button" 
                className="auth-back-link" 
                onClick={() => setStep(1)}
              >
                ← Back to {isSignUp ? 'Registration' : 'Login'}
              </button>
            </form>
          )}
          
          <div className="auth-modal-footer">
            <p>Secure SSL Encrypted Connection</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthModal;
