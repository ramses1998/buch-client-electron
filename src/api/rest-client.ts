import axios, { AxiosInstance } from "axios";

export const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL!,
});

// export const authInterceptor = axios.interceptors.request.use(
//     (config) => {
//         if (config.method?.toLowerCase() === "post") {
//             const accessToken = localStorage.getItem("access_token");
//             if (accessToken) {
//                 // @ts-ignore
//                 config.headers = {
//                     ...config.headers,
//                     Authorization: `Bearer ${accessToken}`,
//                 };
//             }
//         }
//
//         return config;
//     },
//     (error) => {
//         return Promise.reject(error);
//     }
// );
