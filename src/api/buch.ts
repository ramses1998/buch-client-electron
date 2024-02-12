import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type BuchArt = "DRUCKAUSGABE" | "KINDLE";

export type Buch = {
    id: number;
    version: number;
    isbn: string;
    rating: number;
    art: BuchArt;
    preis: number;
    rabatt: string;
    lieferbar: boolean;
    datum: Date;
    homepage: string;
    schlagwoerter: string[];
    titel: string;
    untertitel?: string;
};

export type BuchResponse = Omit<Buch, "datum" | "titel"> & {
    datum: string;
    titel: {
        titel: string;
        untertitel: string;
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
    data: {
        buecher: BuchResponse[];
    };
};
export type BuchItemResponse = {
    data: {
        buch: BuchResponse;
    };
};

export type CreateBuchResponse = {
    id: number;
};

export type UpdateBuchResponse = {
    version: number;
};

export const getAlleBuecherApi = async (): Promise<Buch[]> => {
    return await Promise.resolve(buecher);
};

export const getBuchByIdApi = async (id: number): Promise<Buch> => {
    return Promise.resolve(buecher.find((b: Buch) => b.id === id) as Buch);
};

// export const createBuchApi = async (
//     buchInputModell: BuchInputModell,
// ): Promise<AxiosResponse> => {
//     const body = JSON.stringify({
//         query: `mutation {
//   create(
//     input: {
//       isbn: "${buchInputModell.isbn}",
//       rating: ${buchInputModell.rating},
//       art: ${buchInputModell.art.toUpperCase()},
//       preis: ${buchInputModell.preis},
//       rabatt: ${buchInputModell ? Number(buchInputModell.rabatt) / 100 : 0},
//       lieferbar: ${buchInputModell.lieferbar},
//       datum: "${new Date(buchInputModell.datum).toISOString()}",
//       homepage: "${buchInputModell.homepage}",
//       schlagwoerter: [${
//             buchInputModell.schlagwoerter
//                 ? formatKeywordsForRequest(buchInputModell.schlagwoerter)
//                 : ''
//         }],
//       titel: {
//         titel: "${buchInputModell.titel.titel}",
//         untertitel: "${
//             buchInputModell.untertitel ?? 'Untertitel Create Mutation'
//         }"
//       },
//       abbildungen: [{
//         beschriftung: "Abb. 1",
//         contentType: "img/png"
//       }]
//     }
//   ) {
//       id
//   }
// }`,
//     });
//     console.log(body);
//     //const requestConfig = { ...baseRequestConfig, data: body };
//     return await axios.request(requestConfig);
// };

export const updateBuchApi = async (
    buchUpdateModell: BuchUpdateModell,
    baseRequestConfig: AxiosRequestConfig<string>,
): Promise<AxiosResponse> => {
    const body = JSON.stringify({
        query: `mutation {
  update(
    input: {
      id: ${buchUpdateModell.id},
      version: ${buchUpdateModell.version},
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

const buecher: Buch[] = [
    {
        id: 3,
        version: 3,
        isbn: "978-1-23-456789-1",
        rating: 4.2,
        art: "KINDLE",
        preis: 12.99,
        rabatt: "10%",
        lieferbar: true,
        datum: new Date(),
        homepage: "https://example.com/book3",
        schlagwoerter: ["Science", "Physics"],
        titel: "Einfürung in die Wirtschaftsinformatik",
        untertitel: "Unlocking the Secrets of Space. Exploring Our Galaxy.",
    },
    {
        id: 4,
        version: 1,
        isbn: "978-1-23-456789-2",
        rating: 4.7,
        art: "DRUCKAUSGABE",
        preis: 9.99,
        rabatt: "20%",
        lieferbar: true,
        datum: new Date(),
        homepage: "https://example.com/ebook4",
        schlagwoerter: ["Science", "Astronomy"],
        titel: "The Milky Way Revealed",
        untertitel: "Exploring Our Galaxy",
    },
    {
        id: 5,
        version: 2,
        isbn: "978-1-23-456789-3",
        rating: 3.5,
        art: "KINDLE",
        preis: 24.99,
        rabatt: "0%",
        lieferbar: false,
        datum: new Date(),
        homepage: "https://example.com/book5",
        schlagwoerter: ["History", "Science"],
        titel: "Voyages of Discovery",
        untertitel: "Exploring the Earth's Past",
    },
    {
        id: 6,
        version: 4,
        isbn: "978-1-23-456789-4",
        rating: 4.1,
        art: "KINDLE",
        preis: 14.99,
        rabatt: "15%",
        lieferbar: true,
        datum: new Date(),
        homepage: "https://example.com/audiobook6",
        schlagwoerter: ["Science", "Biology"],
        titel: "The Secret Life of Plants",
        untertitel: "Exploring the Hidden World of Nature",
    },
    {
        id: 7,
        version: 1,
        isbn: "978-1-23-456789-5",
        rating: 4.8,
        art: "DRUCKAUSGABE",
        preis: 29.99,
        rabatt: "3%",
        lieferbar: true,
        datum: new Date(),
        homepage: "https://example.com/book7",
        schlagwoerter: ["Science", "Technology"],
        titel: "The Future of AI",
        untertitel: "Exploring the Rise of Artificial Intelligence",
    },
    {
        id: 8,
        version: 3,
        isbn: "978-1-23-456789-6",
        rating: 3.9,
        art: "DRUCKAUSGABE",
        preis: 17.99,
        rabatt: "7%",
        lieferbar: false,
        datum: new Date(),
        homepage: "https://example.com/book8",
        schlagwoerter: ["History", "Art"],
        titel: "Lost Civilizations",
        untertitel: "Unearthing the Mysteries of the Past",
    },
];
