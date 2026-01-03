import React, { createContext, useState, useCallback } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // 'admin' | 'employee' | null
  const [userName, setUserName] = useState('');

  const login = async (email, password) => {
    try {
      const adminResponse = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (adminResponse.ok) {
        const data = await adminResponse.json();
        saveSession('admin', data.user, data.token);
        return { success: true };
      }

      const userResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (userResponse.ok) {
        const data = await userResponse.json();
        saveSession('employee', data.user, data.token);
        return { success: true };
      }

      return { success: false, message: 'Invalid email or password' };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: 'Login failed. Please check your network connection.' };
    }
  };

  const saveSession = useCallback((role, userObj, token) => {
    setUser(role);
    setUserName(userObj.name || '');
    localStorage.setItem('loggedInUser', JSON.stringify({ role, name: userObj.name, id: userObj._id }));
    localStorage.setItem('token', token);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setUserName('');
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('token');
  }, []);

  const validateRegistration = useCallback(async (email, password, name, organization) => {
    const errors = [];
    if (!email || !email.includes('@')) {
      errors.push('Please enter a valid email address');
    }
    if (!password || password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (!name || name.trim().length < 2) {
      errors.push('Please enter a valid name');
    }
    if (!organization && !organization?.trim()) {
      errors.push('Please enter a valid organization');
    }

    return errors;
  }, []);

  const registerUser = useCallback(async (email, password, name, organization) => {
    const validationErrors = await validateRegistration(email, password, name, organization);
    if (validationErrors.length > 0) {
      return { success: false, message: validationErrors.join('. ') };
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, organization }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else if (res.status === 409) {
        return { success: false, message: 'This email is already registered. Please login instead.' };
      } else if (res.status === 400) {
        return { success: false, message: data.errors?.join('. ') || 'Invalid registration data' };
      } else {
        return { success: false, message: data.message || 'Registration failed. Please try again.' };
      }
    } catch (err) {
      console.error('Registration error:', err);
      return { success: false, message: 'Registration failed. Please check your network connection.' };
    }
  }, [validateRegistration]);

  const registerAdmin = useCallback(async (email, password, name, organization) => {
    const validationErrors = await validateRegistration(email, password, name, organization);
    if (validationErrors.length > 0) {
      return { success: false, message: validationErrors.join('. ') };
    }

    try {
      const res = await fetch('http://localhost:5000/api/admin/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, organization }),
      });

      const data = await res.json();
      if (res.ok) {
        return { success: true };
      } else if (res.status === 409) {
        return { success: false, message: 'This email is already registered. Please login instead.' };
      } else if (res.status === 400) {
        return { success: false, message: data.errors?.join('. ') || 'Invalid admin registration data' };
      } else {
        return { success: false, message: data.message || 'Admin registration failed. Please try again.' };
      }
    } catch (err) {
      console.error('Admin registration error:', err);
      return { success: false, message: 'Admin registration failed. Please check your network connection.' };
    }
  }, [validateRegistration]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      userName, 
      login, 
      logout, 
      registerUser, 
      registerAdmin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
