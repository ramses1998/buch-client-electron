import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosClient } from "@/api/rest-client";

// TODO: HTTPS einrichten
// https://nextjs.org/docs/app/api-reference/next-cli#https-for-local-development
export type LoginDaten = {
    username: string;
    password: string;
};

export type AuthResponse = {
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    "not-before-policy": number;
    session_state: string;
    scope: string;
};

/**
 * Sendet eine Login-Anfrage an den Server mit den bereitgestellten Anmeldedaten.
 *
 * @param loginDaten - Die Login-Daten, die Benutzername und Passwort enthalten.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird, die die Authentifizierungs-Antwortdaten enthält.
 */
export const loginApi = async (
    loginDaten: LoginDaten,
): Promise<AxiosResponse<AuthResponse>> => {
    const urlencoded = new URLSearchParams();
    urlencoded.append("username", loginDaten.username);
    urlencoded.append("password", loginDaten.password);

    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    };
    return await axiosClient.post<AuthResponse>(
        "/auth/login",
        urlencoded,
        requestConfig,
    );
};

/**
 * Sendet eine Anfrage an den Server, um den Authentifizierungs-Token zu aktualisieren.
 *
 * @param refreshToken - Der Refresh-Token, der verwendet wird, um einen neuen Authentifizierungs-Token zu erhalten.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird, die die aktualisierten Authentifizierungsdaten enthält.
 */
export const refreshTokenApi = async (
    refreshToken: string,
): Promise<AxiosResponse<AuthResponse>> => {
    const body = {
        refresh_token: refreshToken,
    };
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "Content-Type": "application/json",
        },
    };
    return await axiosClient.post<AuthResponse>(
        "/auth/refresh",
        JSON.stringify(body),
        requestConfig,
    );
};
