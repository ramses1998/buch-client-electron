"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars,@typescript-eslint/ban-ts-comment */
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import axios, {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosResponseHeaders,
    InternalAxiosRequestConfig,
    RawAxiosResponseHeaders,
} from "axios";
import { loginApi, LoginDaten, LoginResponse } from "@/api/auth";
import { GraphQLErrorItem, GraphqlErrorResponse } from "@/api/graphqlError";
import {
    Buch,
    BuchInputModell,
    BuchResponse,
    BuchUpdateModell,
    createBuchApi,
    deleteBuchApi,
    getAlleBuecherApi,
    getBuchByIdApi,
    updateBuchApi,
} from "@/api/buch";
import { useRouter } from "next/router";

type ContextOutput = {
    isClient: boolean;
    login: (loginDaten: LoginDaten) => Promise<void>;
    logout: () => void;
    isUserAuthenticated: boolean;
    initializeRequestInterceptor: (
        announceTokenValidity: (isTokenValid: boolean) => void,
    ) => void;
    getBuchById: (id: number) => Promise<Buch>;
    getAlleBuecher: () => Promise<Buch[]>;
    createBuch: (buchInputModell: BuchInputModell) => Promise<AxiosResponse>;
    updateBuch: (buch: BuchUpdateModell) => Promise<void>;
    deleteBuch: (id: number) => Promise<void>;
};

// @ts-ignore
const ApplicationContext = createContext<ContextOutput>({});

export const useApplicationContextApi = () => {
    return useContext(ApplicationContext);
};

type Props = PropsWithChildren;
export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [isUserAuthenticated, setIsUserAuthenticated] =
        useState<boolean>(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (hasTokenExpired()) setIsUserAuthenticated(false);
    }, [router]);

    const accessToken =
        typeof localStorage !== "undefined"
            ? localStorage.getItem("auth_token")
            : undefined;

    const baseAxiosRequestConfig: AxiosRequestConfig<string> = {
        method: "post",
        url: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL as string,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    };

    const login = async (loginDaten: LoginDaten) => {
        const loginResponse = await loginApi(loginDaten);
        saveToken(loginResponse.data);
        setIsUserAuthenticated(true);
        //location.reload();
    };

    const logout = () => {
        deleteTokens();
        setIsUserAuthenticated(false);
        // location.reload();
    };

    const saveToken = (loginResponse: LoginResponse) => {
        const {
            access_token,
            expires_in,
            refresh_expires_in,
            refresh_token,
            session_state,
        } = loginResponse;

        const currentDate = new Date();

        const millisecondFactor = 1000;

        const expiryDate = new Date(
            currentDate.getTime() + expires_in * millisecondFactor,
        );

        const refreshExpiryDate = new Date(
            currentDate.getTime() + refresh_expires_in * millisecondFactor,
        );

        localStorage.setItem("access_token", access_token);
        localStorage.setItem("expires", expiryDate.toISOString());
        localStorage.setItem(
            "refresh_expires",
            refreshExpiryDate.toISOString(),
        );
        localStorage.setItem("refresh_token", refresh_token);
        localStorage.setItem("session_state", session_state);
    };

    const deleteTokens = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires");
        localStorage.removeItem("refresh_expires");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("session_state");
    };

    const hasTokenExpired = (): boolean => {
        const currentDate = new Date();
        const expirationTimeStamp = localStorage.getItem("expires");
        return (
            !expirationTimeStamp ||
            currentDate.getTime() > new Date(expirationTimeStamp).getTime()
        );
    };

    const getBuchById = async (id: number): Promise<Buch> => {
        const response = await getBuchByIdApi(id);
        return convertBuchResponseToBuch(response.data, response.headers);
    };

    const getAlleBuecher = async (): Promise<Buch[]> => {
        const response = await getAlleBuecherApi();
        return response.data._embedded.buecher.map((b) =>
            convertBuchResponseToBuch(b, response.headers),
        );
    };

    const createBuch = async (
        buchInputModell: BuchInputModell,
    ): Promise<AxiosResponse> => {
        const createBuchResponse = await createBuchApi(
            buchInputModell,
            baseAxiosRequestConfig,
        );
        handleGraphQLRequestError(
            createBuchResponse.data as unknown as GraphqlErrorResponse,
        );
        return createBuchResponse;
    };

    const updateBuch = async (buch: BuchUpdateModell): Promise<void> => {
        const updateBuchResponse = await updateBuchApi(
            buch,
            baseAxiosRequestConfig,
        );
        handleGraphQLRequestError(
            updateBuchResponse.data as unknown as GraphqlErrorResponse,
        );
    };

    const deleteBuch = async (id: number): Promise<void> => {
        const deleteBuchResponse = await deleteBuchApi(
            id,
            baseAxiosRequestConfig,
        );
        handleGraphQLRequestError(
            deleteBuchResponse.data as unknown as GraphqlErrorResponse,
        );
    };

    const handleGraphQLRequestError = (errorResponse: GraphqlErrorResponse) => {
        const errors: GraphQLErrorItem[] | undefined = errorResponse.errors;
        if (errors === undefined) return;
        const errorMessage: string = errors[0].message;
        if (errorMessage === undefined) {
            const extensionErrorMessage = errors[0].extensions?.stacktrace[0];
            console.error(extensionErrorMessage);
            throw new Error(extensionErrorMessage);
        }
        console.error(errorMessage);
        throw new Error(errorMessage);
    };

    const tokenExistsAndIsValid = (): boolean => {
        const authenticationToken =
            typeof localStorage !== "undefined"
                ? localStorage.getItem("auth_token")
                : undefined;

        switch (authenticationToken) {
            case undefined:
                return false;
            case "undefined":
                return false;
            case null:
                return false;
            case "null":
                return false;
            case "":
                return false;
            default:
                return true;
        }
    };

    const initializeRequestInterceptor = (
        announceTokenValidity: (isTokenValid: boolean) => void,
    ) => {
        const requestInterceptor = (config: InternalAxiosRequestConfig) => {
            if (tokenExistsAndIsValid()) {
                announceTokenValidity(true);
            }
            if (!tokenExistsAndIsValid()) {
                announceTokenValidity(false);
            }
            return config;
        };

        axios.interceptors.request.use(requestInterceptor);
    };

    return (
        <ApplicationContext.Provider
            value={{
                isClient,
                login,
                logout,
                isUserAuthenticated: isUserAuthenticated,
                initializeRequestInterceptor,
                getBuchById,
                getAlleBuecher,
                createBuch,
                updateBuch,
                deleteBuch,
            }}
        >
            {children}
        </ApplicationContext.Provider>
    );
};

const convertBuchResponseToBuch = (
    buchResponse: BuchResponse,
    responseHeader: RawAxiosResponseHeaders | AxiosResponseHeaders,
): Buch => {
    const formattedEtag = Number(
        (responseHeader?.etag as string)?.slice(1, -1),
    );

    return {
        ...buchResponse,
        id: extractIdFromUrl(buchResponse._links.self.href),
        datum: new Date(buchResponse.datum),
        titel: buchResponse.titel.titel,
        rabatt: buchResponse.rabatt * 100,
        version: formattedEtag,
    };
};

const extractIdFromUrl = (url: string): number => {
    const slashSeperatedChars = url.split("/");
    return parseInt(slashSeperatedChars[slashSeperatedChars.length - 1]);
};
