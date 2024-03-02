"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars,@typescript-eslint/ban-ts-comment, @typescript-eslint/no-floating-promises, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";
import {
    AxiosRequestConfig,
    AxiosResponse,
    AxiosResponseHeaders,
    RawAxiosResponseHeaders,
} from "axios";
import {
    loginApi,
    LoginDaten,
    LoginResponse,
    refreshTokenApi,
} from "@/http/auth";
import {
    Buch,
    BuchDto,
    BuchInputModel,
    BuchResponse,
    BuchUpdateModel,
    createBuchApi,
    deleteBuchApi,
    getAlleBuecherApi,
    getBuchByIdApi,
    updateBuchApi,
} from "@/http/buch";
import { useRouter } from "next/router";
import { axiosClient } from "@/http/rest-client";

type ContextOutput = {
    login: (loginDaten: LoginDaten) => Promise<void>;
    logout: () => void;
    isUserAuthenticated: boolean;
    getBuchById: (id: number) => Promise<Buch>;
    getAlleBuecher: () => Promise<Buch[]>;
    createBuch: (buchDto: BuchDto) => Promise<AxiosResponse>;
    updateBuch: (
        id: number,
        version: number,
        buchUpdateModel: BuchUpdateModel,
    ) => Promise<AxiosResponse<void>>;
    deleteBuch: (id: number, version: number) => Promise<AxiosResponse<void>>;
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
    const [isUserAuthenticated, setIsUserAuthenticated] =
        useState<boolean>(false);

    useEffect(() => {
        axiosClient.interceptors.request.use(
            (config) => {
                const httpMethod = config.method?.toLowerCase();
                if (
                    httpMethod === "post" ||
                    httpMethod === "put" ||
                    httpMethod === "delete"
                ) {
                    const accessToken = localStorage.getItem("access_token");
                    if (!accessToken) return config;

                    // @ts-ignore
                    config.headers = {
                        ...config.headers,
                        Authorization: `Bearer ${accessToken}`,
                    };
                    // if (hasTokenExpired()) router.push("/login");
                }

                return config;
            },
            (error) => Promise.reject(error),
        );
    }, []);

    useEffect(() => {
        checkAuthentication();
    }, [router]);

    const checkAuthentication = () => {
        if (hasRefreshTokenExpired()) {
            setIsUserAuthenticated(false);
            return;
        }
        if (hasAccessTokenExpired()) refreshToken();
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

    const hasAccessTokenExpired = (): boolean => {
        const currentDate = new Date();
        const expirationTimeStamp = localStorage.getItem("expires");
        return (
            !expirationTimeStamp ||
            currentDate.getTime() > new Date(expirationTimeStamp).getTime()
        );
    };

    const hasRefreshTokenExpired = (): boolean => {
        const currentDate = new Date();
        const expirationTimeStamp = localStorage.getItem("refresh_expires");
        return (
            !expirationTimeStamp ||
            currentDate.getTime() > new Date(expirationTimeStamp).getTime()
        );
    };

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken || hasRefreshTokenExpired()) {
            await router.push("/login");
            return;
        }
        const loginResponse = await refreshTokenApi(refreshToken);
        saveToken(loginResponse.data);
        setIsUserAuthenticated(true);
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

    const createBuch = async (buchDto: BuchDto): Promise<AxiosResponse> => {
        await refreshToken();
        const buchInputModel = convertBuchDtoToBuchInputModel(buchDto);
        return await createBuchApi(buchInputModel);
    };

    const updateBuch = async (
        id: number,
        version: number,
        buchUpdateModel: BuchUpdateModel,
    ): Promise<AxiosResponse<void>> => {
        return await updateBuchApi(id, version, buchUpdateModel);
    };

    const deleteBuch = async (
        id: number,
        version: number,
    ): Promise<AxiosResponse<void>> => {
        return await deleteBuchApi(id, version);
    };

    // const handleGraphQLRequestError = (errorResponse: GraphqlErrorResponse) => {
    //     const errors: GraphQLErrorItem[] | undefined = errorResponse.errors;
    //     if (errors === undefined) return;
    //     const errorMessage: string = errors[0].message;
    //     if (errorMessage === undefined) {
    //         const extensionErrorMessage = errors[0].extensions?.stacktrace[0];
    //         console.error(extensionErrorMessage);
    //         throw new Error(extensionErrorMessage);
    //     }
    //     console.error(errorMessage);
    //     throw new Error(errorMessage);
    // };

    return (
        <ApplicationContext.Provider
            value={{
                login,
                logout,
                isUserAuthenticated,
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
        untertitel: buchResponse.titel.untertitel,
        rabatt: buchResponse.rabatt,
        version: formattedEtag,
    };
};

const convertBuchDtoToBuchInputModel = (buchDto: BuchDto): BuchInputModel => {
    const { titel, untertitel, ...rest } = buchDto;
    return {
        ...rest,
        titel: {
            titel: titel,
            untertitel: untertitel as string,
        },
    };
};

export const convertBuchDtoToBuchUpdateModel = (
    buchDto: BuchDto,
): BuchUpdateModel => {
    const { version, titel, untertitel, ...rest } = buchDto;
    return {
        ...rest,
    };
};

export const convertBuchToBuchDto = (buch: Buch): BuchDto => {
    const { id, datum, ...rest } = buch;
    return {
        ...rest,
        datum: datum.toISOString(),
    };
};

const extractIdFromUrl = (url: string): number => {
    const slashSeperatedChars = url.split("/");
    return parseInt(slashSeperatedChars[slashSeperatedChars.length - 1]);
};
