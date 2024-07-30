import { jwtDecode } from 'jwt-decode';

interface DecodedObject {
  email: string;
  hd: string;
}

export function decodedToken(token: string): DecodedObject {
  return jwtDecode(token);
}
