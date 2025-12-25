import { create } from 'zustand';

interface User {
  id: string;
  userName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));

// LocalStorage'dan kullanıcıyı yükle
const storedToken = localStorage.getItem('token');
const storedUser = localStorage.getItem('user');

if (storedToken && storedUser) {
  useAuthStore.setState({
    user: JSON.parse(storedUser),
    token: storedToken,
    isAuthenticated: true,
  });
}