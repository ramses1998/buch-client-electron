// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, react-hooks/exhaustive-deps */
import {
    AuthResponse,
    loginApi,
    LoginDaten,
    refreshTokenApi,
} from "@/api/auth";
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
    useEffect,
} from "react";
import { useRouter } from "next/router";
import { axiosClient } from "@/api/rest-client";
import { UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR } from "@/context/ApplicationContextApi";

type Output = {
    auth: AuthResponse | undefined;
    login: (loginDaten: LoginDaten) => Promise<void>;
    logout: () => void;
    refresh: () => Promise<void>;
};

// @ts-expect-error
const AuthContext = createContext<Output>({});

export const useAuthContext = () => {
    return useContext(AuthContext);
};

type Props = PropsWithChildren;

export const AuthContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const [auth, setAuth] = useState<AuthResponse | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        const hasRefreshTokenExpired = (): boolean => {
            if (!auth) return true;
            const currentDate = new Date();
            const expirationTimeStamp = new Date(
                currentDate.getTime() +
                    auth.refresh_expires_in *
                        UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR,
            );
            return (
                !expirationTimeStamp ||
                currentDate.getTime() > new Date(expirationTimeStamp).getTime()
            );
        };

        const requestInterceptor = axiosClient.interceptors.request.use(
            (requestConfig) => {
                const httpMethod = requestConfig.method?.toLowerCase();

                if (router.pathname === "/login") return requestConfig;

                if (
                    httpMethod === "post" ||
                    httpMethod === "put" ||
                    httpMethod === "delete"
                ) {
                    // @ts-expect-error
                    requestConfig.headers = {
                        ...requestConfig.headers,
                        Authorization: `Bearer ${auth!.access_token}`,
                    };
                }
                return requestConfig;
            },
            (error) => Promise.reject(error),
        );

        const responseInterceptor = axiosClient.interceptors.response.use(
            (response) => response,
            async (error) => {
                const request = error?.config;
                const response = error?.response;

                if (response?.status === 401 && !request?.sent) {
                    request.sent = true;

                    if (!auth || hasRefreshTokenExpired()) {
                        await router.push("/login");
                        return Promise.reject(error);
                    }

                    await refresh();
                    request.headers = {
                        ...request.headers,
                        Authorization: `Bearer ${auth.access_token}`,
                    };

                    return axiosClient(request);
                }

                return Promise.reject(error);
            },
        );

        // Entfernen der Interceptors, solbald diese Komponente aus dem DOM ungemountet wird.
        return () => {
            axiosClient.interceptors.request.eject(requestInterceptor);
            axiosClient.interceptors.response.eject(responseInterceptor);
        };
    }, [router]);

    const login = async (loginDaten: LoginDaten): Promise<void> => {
        const loginResponse = await loginApi(loginDaten);
        setAuth(loginResponse.status !== 200 ? undefined : loginResponse.data);
    };

    const logout = () => {
        setAuth(undefined);
    };

    const refresh = async (): Promise<void> => {
        if (!auth) return;
        const refreshResponse = await refreshTokenApi(auth.refresh_token);
        setAuth(
            refreshResponse.status !== 200 ? undefined : refreshResponse.data,
        );
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};
