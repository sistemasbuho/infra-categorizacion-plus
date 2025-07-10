import { jwtDecode } from 'jwt-decode';

interface DecodedObject {
  email: string;
  hd: string;
}

export function decodedTokenInLocalStorage(): DecodedObject | undefined {
  try {
    const token: string | undefined = JSON.parse(localStorage.getItem('token'));

    if (token) {
      return jwtDecode(token);
    }

    if (!token) {
      return undefined;
    }
  } catch (error) {
    console.error(error);
  }
}

export function decodedToken(token: string): DecodedObject {
  return jwtDecode(token);
}
