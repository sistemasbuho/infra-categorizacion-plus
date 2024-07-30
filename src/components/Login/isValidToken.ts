import { jwtDecode } from 'jwt-decode';

interface DecodedObject {
  email: string;
  hd: string;
}

export function decodedToken(): DecodedObject {
  try {
    const token: string | undefined= JSON.parse(localStorage.getItem('token'));
    if (token) {
      return jwtDecode(token);
    }
    
    if (!token) {
      throw new Error('Invalid token');
    }
  } catch (error) {
    console.log(error);
  }
}
