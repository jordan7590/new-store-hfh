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
  const [customerID, setCustomerID] = useState(null);


  useEffect(() => {
    setIsLoggedIn(!!storedToken);
    const storedCustomerID = localStorage.getItem('customerID');
    if (storedCustomerID) {
      setCustomerID(storedCustomerID);
    }
  }, [storedToken]);


  const fetchUserData = async (accessToken) => {
    try {
      const response = await fetch('https://hfh.tonserve.com/wp-json/wp/v2/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user data');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  };

  const login = async (token, initialUserData) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('isLoggedIn', 'true');
    setAccessToken(token);
    setIsLoggedIn(true);
  
    // Fetch additional user data
    const fullUserData = await fetchUserData(token);
    if (fullUserData) {
      localStorage.setItem('userData', JSON.stringify(fullUserData));
      setUserData(fullUserData);
      if (fullUserData.id) {
        setCustomerID(fullUserData.id);
        localStorage.setItem('customerID', fullUserData.id);
      }
    } else {
      // Fallback to initial user data if fetch fails
      localStorage.setItem('userData', JSON.stringify(initialUserData));
      setUserData(initialUserData);
      if (initialUserData.id) {
        setCustomerID(initialUserData.id);
        localStorage.setItem('customerID', initialUserData.id);
      }
    }
  };


const logout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('userData');
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('customerID');
  setAccessToken('');
  setUserData(null);
  setIsLoggedIn(false);
  setCustomerID(null);
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
        await login(data.data.token, userData);
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

  const loginHandler = async (token, user) => {
    await login(token, user);
  };

  const updateUserData = (data) => {
    setUserData(prevData => ({
        ...prevData,
        ...data
    }));
};


  return (
    <AuthContext.Provider value={{ 
      accessToken, 
      userData, 
      updateUserData,
      isLoggedIn, 
      login: loginHandler, 
      logout, 
      refreshToken,
      authenticatedFetch,
      customerID
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;