import axios, { AxiosInstance } from "axios";

/**
 * Erstellt eine Axios-Instanz mit der Basis-URL aus der Umgebungsvariablen `NEXT_PUBLIC_BACKEND_SERVER_URL`.
 *
 * @see https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables
 */
export const axiosClient: AxiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
    timeout: process.env.NEXT_PUBLIC_REQUEST_TIMEOUT as unknown as number,
});
