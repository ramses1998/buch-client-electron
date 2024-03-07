import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL!,
});
