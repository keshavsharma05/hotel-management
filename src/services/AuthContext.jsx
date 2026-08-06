import React, { createContext, useContext, useState, useEffect } from 'react';
import { clearCart, verifyOtpApi, adminLoginApi, getUserProfile, updateUserName } from './api';

const AuthContext = createContext(null);
const USER_SESSION_KEY = 'hotel_user_session_v1';
const ADMIN_SESSION_KEY = 'hotel_admin_session_v1';

export const AuthProvider = ({ children }) => {
  // Only store token + phoneNumber in localStorage — full profile comes from DB
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem(ADMIN_SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [otpSent, setOtpSent] = useState(false);

  // On mount: if we have a stored session, refresh user/admin profile from MongoDB
  useEffect(() => {
    const refreshProfile = async () => {
      // 1. Refresh User
      const savedUser = localStorage.getItem(USER_SESSION_KEY);
      if (savedUser) {
        try {
          const session = JSON.parse(savedUser);
          if (session?.token) {
            const profile = await getUserProfile();
            if (profile && !profile.error) {
              const refreshed = { ...session, name: profile.name, role: profile.role };
              localStorage.setItem(USER_SESSION_KEY, JSON.stringify(refreshed));
              setUser(refreshed);
            } else if (profile && (profile.status === 401 || profile.error === 'Unauthorized')) {
              console.warn('[AUTH] User session is invalid or expired. Logging out.');
              setUser(null);
              localStorage.removeItem(USER_SESSION_KEY);
            }
          }
        } catch (e) {
          console.error('[AUTH] Failed to parse user session:', e);
        }
      }

      // 2. Refresh Admin
      const savedAdmin = localStorage.getItem(ADMIN_SESSION_KEY);
      if (savedAdmin) {
        try {
          const session = JSON.parse(savedAdmin);
          if (session?.token) {
            const profile = await getUserProfile();
            if (profile && !profile.error) {
              const refreshed = { ...session, role: profile.role };
              localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(refreshed));
              setAdmin(refreshed);
            } else if (profile && (profile.status === 401 || profile.error === 'Unauthorized')) {
              console.warn('[AUTH] Admin session is invalid or expired. Logging out.');
              setAdmin(null);
              localStorage.removeItem(ADMIN_SESSION_KEY);
            }
          }
        } catch (e) {
          console.error('[AUTH] Failed to parse admin session:', e);
        }
      }
    };
    refreshProfile();
  }, []);

  // Listen to global unauthorized event to clean up state immediately
  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setAdmin(null);
    };
    window.addEventListener('auth-unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth-unauthorized', handleUnauthorized);
    };
  }, []);

  // Persist session changes to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_SESSION_KEY);
    }
  }, [user]);

  useEffect(() => {
    if (admin) {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
    } else {
      localStorage.removeItem(ADMIN_SESSION_KEY);
    }
  }, [admin]);

  const loginWithPhone = (phoneNumber) => {
    console.log(`[AUTH] Sending OTP: 1234 to ${phoneNumber}`);
    setOtpSent(true);
    return { success: true };
  };

  const verifyOTP = async (phoneNumber, otp, mode = 'login', name = '') => {
    try {
      const res = await verifyOtpApi(phoneNumber, otp, mode, name);
      if (res.success) {
        // Backend returns user data from MongoDB; fall back to phone if somehow missing
        const dbUser = res.user || {};
        const sessionData = {
          phoneNumber: dbUser.phoneNumber || phoneNumber,
          name: dbUser.name || '',
          role: dbUser.role || 'USER',
          token: res.token,
        };

        // Sync to localStorage immediately so all subsequent API calls have the token
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
        setUser(sessionData);
        setOtpSent(false);

        const isNewUser = !dbUser.name;
        return { success: true, isNewUser, token: res.token };
      }
      return { success: false, message: res.message || 'Invalid OTP' };
    } catch (err) {
      console.error('[AuthContext verifyOTP] Error:', err);
      return { success: false, message: err.message || 'Server error during verification' };
    }
  };

  // Called after signup to save the user's name to MongoDB
  const completeSignup = async (userData, token) => {
    try {
      const updated = await updateUserName(userData.name);
      const sessionData = {
        phoneNumber: userData.phoneNumber,
        name: updated.name || userData.name,
        role: updated.role || 'USER',
        token,
      };
      localStorage.setItem(USER_SESSION_KEY, JSON.stringify(sessionData));
      setUser(sessionData);
      setOtpSent(false);
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  // Update name in MongoDB and reflect in local state
  const updateUserProfile = async (updates) => {
    if (!user) return;
    if (updates.name) {
      await updateUserName(updates.name);
    }
    const updatedUser = { ...user, ...updates };
    localStorage.setItem(USER_SESSION_KEY, JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const loginAsAdmin = async (username, password) => {
    try {
      const res = await adminLoginApi(username, password);
      if (res.success) {
        const adminData = {
          username: 'admin',
          role: 'ADMIN',
          token: res.token,
          lastLogin: new Date().toISOString()
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(adminData));
        setAdmin(adminData);
        return { success: true };
      }
      return { success: false, message: res.message || 'Invalid credentials' };
    } catch (err) {
      return { success: false, message: 'Server error during login' };
    }
  };

  const logout = () => {
    setUser(null);
    setOtpSent(false);
    clearCart();
  };

  const adminLogout = () => {
    setAdmin(null);
  };

  const isAdminAuthenticated = () => {
    return admin && admin.role === 'ADMIN' && admin.token;
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      otpSent,
      loginWithPhone,
      verifyOTP,
      completeSignup,
      updateUserProfile,
      loginAsAdmin,
      logout,
      adminLogout,
      isAdminAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
