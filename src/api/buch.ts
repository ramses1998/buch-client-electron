import { AxiosRequestConfig, AxiosResponse } from "axios";
import { axiosClient } from "@/api/rest-client";

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

/**
 * Eine Anfrage wird über REST an den Server abgesetzt, um Bücher zu laden.
 *
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird, die eine Liste von Büchern enthält.
 */
export const getAlleBuecherApi = async (): Promise<
    AxiosResponse<BuchListResponse>
> => {
    return await axiosClient.get<BuchListResponse>("/rest");
};

/**
 * Eine Anfrage wird über REST an den Server abgesetzt, um ein Buch zu laden.
 *
 * @param id - Die ID des Buches, das abgerufen werden soll.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird, die das Buch mit der angegebenen ID enthält.
 */
export const getBuchByIdApi = async (
    id: number,
): Promise<AxiosResponse<BuchResponse>> => {
    return await axiosClient.get<BuchResponse>(`/rest/${id}`);
};

/**
 * Erstellt ein neues Buch.
 *
 * @param buchInputModel - Das Modell, das die Daten für das neue Buch enthält.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird.
 */
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

/**
 * Aktualisiert ein vorhandenes Buch.
 *
 * @param id - Die ID des Buches, das aktualisiert werden soll.
 * @param version - Die ETag-Version des Buches, die für die optimistische Synchronisierung verwendet wird.
 * @param buchUpdateModel - Das Modell, das die aktualisierten Daten für das Buch enthält.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird.
 */
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

/**
 * Löscht ein vorhandenes Buch.
 *
 * @param id - Die ID des Buches, das gelöscht werden soll.
 * @param version - Die ETag-Version des Buches, die für die optimistische Synchronisierung verwendet wird.
 * @returns Ein Promise, das mit einer AxiosResponse aufgelöst wird, die angibt, ob das Buch erfolgreich gelöscht wurde.
 */
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
