"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/ban-ts-comment, @typescript-eslint/no-floating-promises, react-hooks/exhaustive-deps, @typescript-eslint/no-unused-vars */
import React, { createContext, PropsWithChildren, useContext } from "react";
import {
    AxiosResponse,
    AxiosResponseHeaders,
    RawAxiosResponseHeaders,
} from "axios";
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
} from "@/api/buch";
import { InputTypeMap } from "@mui/joy/Input/InputProps";

type ContextOutput = {
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

export const UNIX_TIME_TO_JAVASCRIPT_TIME_FACTOR = 1000;

type Props = PropsWithChildren;
export const ApplicationContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;

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

    return (
        <ApplicationContext.Provider
            value={{
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

export type InputField = InputTypeMap["props"] & {
    isDropdown?: boolean | undefined;
    options?: string[];
    isDynamicList?: boolean | undefined;
};

export const regexValidator = {
    isbn: /^(?:ISBN(?:-13)?:? )?(?=\d{13}$|(?=(?:\d+[- ]){4})[- \d]{17}$)97[89][- ]?\d{1,5}[- ]?(?:\d+[- ]\d+|\d{2,})[- ]?\d$/,
    titel: /^.{0,40}$/,
    untertitel: /^.{0,40}$/,
    rating: /^[0-5]$/,
    preis: /^\d+(\.\d{1,2})?$/,
    rabatt: /^(0|\d+\.\d{0,3})?$/,
    homepage:
        /^https?:\/\/(?:www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z\d()]{1,6}\b[-\w()@:%+.~#?&/=]*$/,
};
