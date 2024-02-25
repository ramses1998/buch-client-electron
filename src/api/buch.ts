import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

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

export type BuchInputModell = Omit<BuchResponse, "id" | "version" | "datum"> & {
    datum: Date;
};

export type BuchUpdateModell = Omit<
    BuchResponse,
    "lieferbar" | "id" | "rabatt" | "titel"
> & {
    datum: Date;
    lieferbar: string;
    id: string;
    rabatt: number;
};

const lieferbarToBoolean = (lieferbar: string): boolean => {
    if (lieferbar === "true") {
        return true;
    }
    return false;
};

const stringToDate = (datum: string): Date => {
    const [day, month, year] = datum.split(".");
    const formattedDate = `${year}-${month}-${day}`;
    return new Date(formattedDate);
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
    return await axios.get<BuchListResponse>(
        process.env.NEXT_PUBLIC_BACKEND_SERVER_REST_URL!,
    );
};

export const getBuchByIdApi = async (
    id: number,
): Promise<AxiosResponse<BuchResponse>> => {
    return await axios.get<BuchResponse>(
        `${process.env.NEXT_PUBLIC_BACKEND_SERVER_REST_URL!}/${id}`,
    );
};

export const createBuchApi = async (
    buchInputModell: BuchInputModell,
    baseRequestConfig: AxiosRequestConfig<string>,
): Promise<AxiosResponse> => {
    const body = JSON.stringify({
        query: `mutation {
  create(
    input: {
      isbn: "${buchInputModell.isbn}",
      rating: ${buchInputModell.rating},
      art: ${buchInputModell.art.toUpperCase()},
      preis: ${buchInputModell.preis},
      rabatt: ${buchInputModell ? Number(buchInputModell.rabatt) / 100 : 0},
      lieferbar: ${buchInputModell.lieferbar},
      datum: "${new Date(buchInputModell.datum).toISOString()}",
      homepage: "${buchInputModell.homepage}",
      schlagwoerter: [${
          buchInputModell.schlagwoerter
              ? formatKeywordsForRequest(buchInputModell.schlagwoerter)
              : ""
      }],
      titel: {
        titel: "${buchInputModell.titel.titel}",
        untertitel: "${
            buchInputModell.untertitel ?? "Untertitel Create Mutation"
        }"
      },
      abbildungen: [{
        beschriftung: "Abb. 1",
        contentType: "img/png"
      }]
    }
  ) {
      id
  }
}`,
    });
    console.log(body);
    const requestConfig = { ...baseRequestConfig, data: body };
    return await axios.request(requestConfig);
};

export const updateBuchApi = async (
    buchUpdateModell: BuchUpdateModell,
    baseRequestConfig: AxiosRequestConfig<string>,
): Promise<AxiosResponse> => {
    const body = JSON.stringify({
        query: `mutation {
  update(
    input: {
      id: ${buchUpdateModell.id},      
      isbn: "${buchUpdateModell.isbn}",
      rating: ${buchUpdateModell.rating},
      art: ${buchUpdateModell.art},
      preis: ${buchUpdateModell.preis},
      rabatt: ${buchUpdateModell ? Number(buchUpdateModell.rabatt) / 100 : 0},
      lieferbar: ${lieferbarToBoolean(buchUpdateModell.lieferbar)},
      datum: "${stringToDate(buchUpdateModell.datum).toISOString()}",
      homepage: "${buchUpdateModell.homepage}",
      schlagwoerter: [${formatKeywordsForRequest(
          buchUpdateModell.schlagwoerter,
      )}],
    }
  ) {
      version
  }
}`,
    });
    const requestConfig = { ...baseRequestConfig, data: body };
    return await axios.request(requestConfig);
};

export const deleteBuchApi = async (
    id: number,
    baseRequestConfig: AxiosRequestConfig<string>,
): Promise<AxiosResponse<void>> => {
    const body = JSON.stringify({
        query: `mutation {
        delete(id: "${id}")
        }`,
    });
    const requestConfig = { ...baseRequestConfig, data: body };
    return await axios.request(requestConfig);
};

const formatKeywordsForRequest = (keywords: string[]): string => {
    return keywords.map((s) => `"${s}"`).join(", ");
};
