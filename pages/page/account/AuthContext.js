import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const storedToken = localStorage.getItem('accessToken');
  const storedUserData = JSON.parse(localStorage.getItem('userData'));
  const storedIsLoggedIn = localStorage.getItem('isLoggedIn');

  const [accessToken, setAccessToken] = useState(storedToken || '');
  const [userData, setUserData] = useState(storedUserData || null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!storedIsLoggedIn);

  useEffect(() => {
    setIsLoggedIn(!!storedToken);
  }, [storedToken]);

  const login = (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('isLoggedIn', 'true');
    setAccessToken(token);
    setUserData(user);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    setAccessToken('');
    setUserData(null);
    setIsLoggedIn(false);
  };

  const refreshToken = async () => {
    try {
      const response = await fetch("https://hfh.tonserve.com/wp-json/jwt-auth/v1/token/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
      });

      const data = await response.json();

      if (data.success && data.data && data.data.token) {
        login(data.data.token, userData);
        return true;
      } else {
        throw new Error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Token refresh error:", error);
      logout();
      return false;
    }
  };

  const authenticatedFetch = async (url, options = {}) => {
    let response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (response.status === 401) {
      // Token has expired, try to refresh it
      const isRefreshed = await refreshToken();
      
      if (isRefreshed) {
        // Retry the original request with the new token
        response = await fetch(url, {
          ...options,
          headers: {
            ...options.headers,
            'Authorization': `Bearer ${accessToken}`
          }
        });
      } else {
        throw new Error('Session expired. Please login again.');
      }
    }

    return response;
  };

  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      userData, 
      isLoggedIn, 
      login, 
      logout, 
      refreshToken,
      authenticatedFetch 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;