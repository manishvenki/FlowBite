import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, Address } from '../types/user';
import { authService, LoginDTO, RegisterDTO } from '../services/authService';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (data: LoginDTO) => Promise<User>;
  register: (data: RegisterDTO) => Promise<User>;
  logout: () => void;
  updateProfile: (data: { name?: string; phone?: string }) => Promise<User>;
  addAddress: (data: Omit<Address, '_id'>) => Promise<Address[]>;
  updateAddress: (addressId: string, data: Partial<Address>) => Promise<Address[]>;
  deleteAddress: (addressId: string) => Promise<Address[]>;
  setDefaultAddress: (addressId: string) => Promise<Address[]>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('biteflow_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const activeToken = localStorage.getItem('biteflow_token');
      if (activeToken) {
        const { user: currentUser } = await authService.getMe();
        setUser(currentUser);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Failed to load current user session:', err);
      localStorage.removeItem('biteflow_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (data: LoginDTO): Promise<User> => {
    const res = await authService.login(data);
    localStorage.setItem('biteflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (data: RegisterDTO): Promise<User> => {
    const res = await authService.register(data);
    localStorage.setItem('biteflow_token', res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem('biteflow_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (data: { name?: string; phone?: string }): Promise<User> => {
    const updated = await authService.updateProfile(data);
    setUser(updated);
    return updated;
  };

  const addAddress = async (data: Omit<Address, '_id'>): Promise<Address[]> => {
    const addresses = await authService.addAddress(data);
    if (user) {
      setUser({ ...user, addresses });
    }
    return addresses;
  };

  const updateAddress = async (addressId: string, data: Partial<Address>): Promise<Address[]> => {
    const addresses = await authService.updateAddress(addressId, data);
    if (user) {
      setUser({ ...user, addresses });
    }
    return addresses;
  };

  const deleteAddress = async (addressId: string): Promise<Address[]> => {
    const addresses = await authService.deleteAddress(addressId);
    if (user) {
      setUser({ ...user, addresses });
    }
    return addresses;
  };

  const setDefaultAddress = async (addressId: string): Promise<Address[]> => {
    const addresses = await authService.setDefaultAddress(addressId);
    if (user) {
      setUser({ ...user, addresses });
    }
    return addresses;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
