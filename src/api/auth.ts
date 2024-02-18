import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

// https://nextjs.org/docs/app/api-reference/next-cli#https-for-local-development
export type LoginDaten = {
    username: string;
    password: string;
};

export type GraphQlLoginResponse = {
    data: {
        login: {
            token: string;
        };
    };
};

export const loginApi = async (
    loginDaten: LoginDaten,
    baseRequestConfig: AxiosRequestConfig<string>,
): Promise<AxiosResponse<GraphQlLoginResponse>> => {
    const body = JSON.stringify({
        query: `mutation {
                        login(username: "${loginDaten.username}", password: "${loginDaten.password}") {
                             token
                        }
                    }`,
    });
    const requestConfig = { ...baseRequestConfig, data: body };
    return await axios.request(requestConfig);
};
