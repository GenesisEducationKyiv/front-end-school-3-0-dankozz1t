import axios, { type AxiosInstance } from 'axios';

const http: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

http.interceptors.response.use(response => response.data);

export default http;
