import { createContext, useState, useEffect, useContext } from 'react';
import { api } from '@/api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data.role !== 'admin') {
          throw new Error('Not an admin');
        }
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user', error);
        localStorage.removeItem('admin_token');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password,
    });

    const { access_token } = response.data;
    localStorage.setItem('admin_token', access_token);

    // fetch user again
    const meResponse = await api.get('/auth/me');
    if (meResponse.data.role !== 'admin') {
      localStorage.removeItem('admin_token');
      throw new Error('Unauthorized');
    }

    setUser(meResponse.data);
    navigate('/dashboard');
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
