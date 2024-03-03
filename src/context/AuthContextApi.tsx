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
import {UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR} from "@/context/ApplicationContextApi";

type Output = {
    auth: AuthResponse | undefined;
    login: (loginDaten: LoginDaten) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
};

// @ts-ignore
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
        const requestInterceptor = axiosClient.interceptors.request.use(
            (requestConfig) => {
                const httpMethod = requestConfig.method?.toLowerCase();

                if (router.pathname === "/login") return requestConfig;

                if (
                    httpMethod === "post" ||
                    httpMethod === "put" ||
                    httpMethod === "delete"
                ) {
                    // @ts-ignore
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
                    await refresh();
                    request.headers = {
                        ...request.headers,
                        Authorization: `Bearer ${auth!.access_token}`,
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
        setAuth(loginResponse.data);
    };

    const logout = async (): Promise<void> => {
        setAuth(undefined);
    };

    const refresh = async (): Promise<void> => {
        if (!auth || hasRefreshTokenExpired()) {
            await router.push("/login");
            return;
        }
        const refreshResponse = await refreshTokenApi(auth.refresh_token);
        setAuth(refreshResponse.data);
    };

    const hasRefreshTokenExpired = (): boolean => {
        if (!auth) return true;
        const currentDate = new Date();
        const expirationTimeStamp = new Date(
            currentDate.getTime() +
            auth.refresh_expires_in * UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR,
        );
        return (
            !expirationTimeStamp ||
            currentDate.getTime() > new Date(expirationTimeStamp).getTime()
        );
    };

    return (
        <AuthContext.Provider value={{ auth, login, logout, refresh }}>
            {children}
        </AuthContext.Provider>
    );
};
