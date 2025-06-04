import { categorizationPlusRequest } from './axiosRequest';

type LogResponse = {
  token: string;
};

export async function login(logData: { username: string; password: string }) {
  return await categorizationPlusRequest<LogResponse>({
    method: 'POST',
    url: 'token/',
    data: logData,
  });
}

type RefreshTokenResponse = {
  access: string;
  refresh: string;
};

export async function refreshToken(accessToken: string) {
  return await categorizationPlusRequest<RefreshTokenResponse>({
    method: 'POST',
    url: 'refresh/',
    data: {
      refresh: accessToken,
    },
  });
}
