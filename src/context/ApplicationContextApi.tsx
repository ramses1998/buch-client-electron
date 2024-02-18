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
  InternalAxiosRequestConfig,
} from "axios";
import { GraphQlLoginResponse, loginApi, LoginDaten } from "@/api/auth";
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

type ContextOutput = {
  isClient: boolean;
  login: (loginDaten: LoginDaten) => Promise<void>;
  logout: () => void;
  tokenExistsAndIsValid: () => boolean;
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const authenticationToken =
    typeof localStorage !== "undefined"
      ? localStorage.getItem("auth_token")
      : undefined;

  const baseAxiosRequestConfig: AxiosRequestConfig<string> = {
    method: "post",
    url: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL as string,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authenticationToken}`,
    },
  };

  const login = async (loginDaten: LoginDaten) => {
    const loginResponse: AxiosResponse<GraphQlLoginResponse> = await loginApi(
      loginDaten,
      baseAxiosRequestConfig,
    );
    handleGraphQLRequestError(loginResponse.data as GraphqlErrorResponse);
    saveToken(loginResponse.data.data.login.token);
    location.reload();
  };

  const logout = () => {
    deleteToken();
    location.reload();
  };

  const saveToken = (token: string) => {
    localStorage.setItem("auth_token", token);
  };

  const deleteToken = () => {
    localStorage.removeItem("auth_token");
  };

  const getBuchById = async (id: number): Promise<Buch> => {
    const response = await getBuchByIdApi(id, baseAxiosRequestConfig);
    handleGraphQLRequestError(response.data as unknown as GraphqlErrorResponse);
    return convertBuchResponseToBuch(response.data.data.buch);
  };

  const getAlleBuecher = async (): Promise<Buch[]> => {
    const response = await getAlleBuecherApi(baseAxiosRequestConfig);
    handleGraphQLRequestError(response.data as unknown as GraphqlErrorResponse);
    return response.data.data.buecher.map((b) => convertBuchResponseToBuch(b));
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
    const deleteBuchResponse = await deleteBuchApi(id, baseAxiosRequestConfig);
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
        tokenExistsAndIsValid,
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

const convertBuchResponseToBuch = (buchResponse: BuchResponse): Buch => {
  return {
    ...buchResponse,
    datum: new Date(buchResponse.datum),
    titel: buchResponse.titel.titel,
  };
};
