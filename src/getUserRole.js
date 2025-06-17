import { jwtDecode } from 'jwt-decode';

export const getUserRole = () => {
  const token = localStorage.getItem('authToken');

  if (!token) return null;
  
  try {
    return jwtDecode(token).role;
  } catch {
    return null;
  }
};
