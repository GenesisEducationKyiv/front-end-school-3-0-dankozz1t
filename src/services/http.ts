import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

interface HttpResponse<T = unknown> extends AxiosResponse<T> {
  data: T;
}

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

http.interceptors.response.use(
  <T>(response: AxiosResponse<T>): T => response.data,
  (error): Promise<never> => Promise.reject(error)
);

export default http;
export type { HttpResponse };
