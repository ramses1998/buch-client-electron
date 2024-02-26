import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosClient } from "@/http/rest-client";

export type BuchArt = "DRUCKAUSGABE" | "KINDLE";

export type Buch = {
    id: number;
    version?: number;
    isbn: string;
    rating: number;
    art: BuchArt;
    preis: number;
    rabatt: number;
    lieferbar: boolean;
    datum: Date;
    homepage: string;
    schlagwoerter: string[];
    titel: string;
    untertitel?: string;
};

export type BuchDto = Omit<Buch, "id" | "datum"> & {
    datum: string;
};

export type BuchResponse = Omit<Buch, "datum" | "titel" | "version"> & {
    datum: string;
    titel: {
        titel: string;
        untertitel: string;
    };
    _links: {
        self: {
            href: string;
        };
        list?: {
            href: string;
        };
        add?: {
            href: string;
        };
        update?: {
            href: string;
        };
        remove?: {
            href: string;
        };
    };
};

export type BuchInputModel = Omit<Buch, "id" | "datum" | "titel"> & {
    datum: string;
    titel: {
        titel: string;
        untertitel: string;
    };
};

export type BuchUpdateModel = Omit<
    Buch,
    "id" | "version" | "titel" | "datum" | "untertitel"
> & {
    datum: string;
};

export type BuchListResponse = {
    _embedded: {
        buecher: BuchResponse[];
    };
};

export type CreateBuchResponse = {
    id: number;
};

export type UpdateBuchResponse = {
    version: number;
};

export const getAlleBuecherApi = async (): Promise<
    AxiosResponse<BuchListResponse>
> => {
    return await axiosClient.get<BuchListResponse>("/rest");
};

export const getBuchByIdApi = async (
    id: number,
): Promise<AxiosResponse<BuchResponse>> => {
    return await axiosClient.get<BuchResponse>(`/rest/${id}`);
};

export const createBuchApi = async (
    buchInputModel: BuchInputModel,
): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        method: "POST",
        url: "/rest",
        headers: {
            "Content-Type": "application/json",
        },
        data: JSON.stringify(buchInputModel),
    };
    return await axiosClient.request(requestConfig);
};

export const updateBuchApi = async (
    id: number,
    version: number,
    buchUpdateModel: BuchUpdateModel,
): Promise<AxiosResponse> => {
    const requestConfig: AxiosRequestConfig = {
        headers: {
            "If-Match": `"${version}"`,
            "Content-Type": "application/json",
        },
    };
    const serializedBody = JSON.stringify(buchUpdateModel);
    return await axiosClient.put(`/rest/${id}`, serializedBody, requestConfig);
};

export const deleteBuchApi = async (
    id: number,
    version: number,
): Promise<AxiosResponse<void>> => {
    const requestConfig: AxiosRequestConfig = {
        method: "DELETE",
        url: `/rest/${id}`,
        headers: {
            "If-Match": `"${version}"`,
            "Content-Type": "application/json",
        },
    };
    return await axiosClient.request(requestConfig);
};
