import axios, { AxiosRequestConfig } from 'axios';

const AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_PLUS_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function categorizationPlusRequest<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const res = await AxiosInstance<T>(config);
    return res.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
