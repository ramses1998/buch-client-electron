import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosClient } from "@/http/rest-client";

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
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return await axiosClient.post<LoginResponse>(
        "/auth/login",
        urlencoded,
        requestConfig,
    );
};

export const refreshTokenApi = async (
    refreshToken: string,
): Promise<AxiosResponse<LoginResponse>> => {
    const body = {
        refresh_token: refreshToken,
    };
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    return await axiosClient.post<LoginResponse>(
        "/auth/refresh",
        JSON.stringify(body),
        requestConfig,
    );
};
