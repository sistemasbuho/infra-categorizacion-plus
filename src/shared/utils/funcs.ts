import CryptoJS from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import axios from 'axios';
import { OverlappingProps } from '../types/generals';

const DATA_SESSION = 'userDatas';

export const isOverlappingFragment = ({
  startIndex,
  length,
  allFragments,
}: OverlappingProps): boolean => {
  const endIndex = Number(startIndex + length);
  return allFragments.some(
    ({ start_index: selStart, article_fragment: selLength }) => {
      selStart = Number(selStart);
      const selEnd = selStart + selLength.length;
      return startIndex < selEnd && endIndex > selStart;
    }
  );
};

export async function reqtsApiForm(
  urlApi: string,
  withToken = false,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  params: any,
  mSuccess: (data: any) => any,
  mError: (error: any) => any,
  multipart = false
) {
  let token = '';
  if (withToken) {
    const session = getVarSsn();
    token = session?.access ?? '';
  }

  const headers: Record<string, string> = {
    'Content-Type': multipart ? 'multipart/form-data' : 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };

  try {
    const resp = await axios({
      method,
      url: `${(import.meta as any).env.VITE_API_URL}/${urlApi}/`,
      headers,
      timeout: 30000,
      data: params,
    });
    return mSuccess(resp.data);
  } catch (err) {
    console.error(err);
    throw mError(err);
  }
}

export async function GeneralRequest(
  route: string,
  type: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  params: any = {}
) {
  return await reqtsApiForm(
    route,
    true,
    type,
    params,
    (data) => data,
    (err) => {
      throw err;
    }
  );
}

export function wrap(message: string, info: string): string {
  return CryptoJS.AES.encrypt(message, info).toString();
}
export function unwrap(message: string, info: string): any {
  const bytes = CryptoJS.AES.decrypt(message, info);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

export function getTag(): string {
  const date = new Date();
  const message =
    'j2ECY#*whX^---xygt--onti#dM%WR3xGgW' +
    date.getDay() +
    '*' +
    date.getMonth() +
    '*' +
    date.getFullYear();
  const nonce = '_>_';
  const path = '/';
  const privateKey = '@insYz#*whX^8N4!92uz2htv#dM%W45gs7tGgW';
  const hashDigest = sha256(nonce + message);
  return Base64.stringify(hmacSHA512(path + hashDigest, privateKey));
}

export function setLogin(dt: any): void {
  const tag = getTag();
  const encrypted = wrap(JSON.stringify(dt), tag);
  localStorage.setItem(DATA_SESSION, encrypted);
  if (dt.cliente?.id) {
    localStorage.setItem('cliente', String(dt.cliente.id));
  }

  // Dispara evento personalizado para notificar cambios
  window.dispatchEvent(new CustomEvent('tokenChanged'));
}

export function getVarSsn(): any | null {
  const session = localStorage.getItem(DATA_SESSION);
  if (!session) return null;
  try {
    return unwrap(session, getTag());
  } catch {
    cleanVarSsn();
    return null;
  }
}

export function cleanVarSsn(): void {
  localStorage.removeItem(DATA_SESSION);
  localStorage.removeItem('cliente');
  localStorage.removeItem('userData');
  localStorage.removeItem('email');
  localStorage.removeItem('isChecked');
  localStorage.removeItem('token');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user');

  // Dispara evento personalizado para notificar cambios
  window.dispatchEvent(new CustomEvent('tokenChanged'));

  window.location.reload();
}
