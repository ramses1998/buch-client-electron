import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// TODO: HTTPS einrichten
// https://nextjs.org/docs/app/api-reference/next-cli#https-for-local-development
export type LoginDaten = {
    username: string;
    password: string;
};

export type LoginResponse = {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
};

export const loginApi = async (
    loginDaten: LoginDaten,
): Promise<AxiosResponse<LoginResponse>> => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", loginDaten.username);
    urlencoded.append("password", loginDaten.password);

    const requestConfig: AxiosRequestConfig = {
        method: "POST",
        url: process.env.NEXT_PUBLIC_BACKEND_SERVER_LOGIN_URL!,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: urlencoded,
    };
    return await axios.request<LoginResponse>(requestConfig);
};
