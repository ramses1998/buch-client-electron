import { Buch } from "@/api/buch";
import { useEffect, useState } from "react";

/**
 * Typ für die Eingabe-Daten der Suchfunktion.
 */
type Input = {
    searchQuery: string;
    buecher: Buch[];
};

/**
 * Typ für das Ausgabe-Objekt der Suchfunktion.
 */
type Output = {
    searchResult: Buch[];
};

/**
 * Hook zum Suchen von Büchern in React-Komponenten.
 *
 * @param input - Die Eingabe-Daten für die Suche.
 * @returns Die gefilterten Suchergebnisse.
 */
export const useSearchBooks = (input: Input): Output => {
    const { searchQuery, buecher } = input;
    const [searchResult, setSearchResult] = useState<Buch[]>(buecher);

    useEffect(() => {
        setSearchResult(buecher);
    }, [buecher]);

    useEffect(() => {
        const searchBuchFromInputString = (
            queryString: string,
            buecherList: Buch[],
        ): Buch[] => {
            if (buecherList === undefined || queryString === "")
                return buecherList;

            const queryToLowercase = queryString.toLowerCase();

            return buecherList.filter((item) =>
                item.titel.toLowerCase().includes(queryToLowercase),
            );
        };

        const result = searchBuchFromInputString(searchQuery, buecher);
        setSearchResult(result);
    }, [buecher, searchQuery]);

    return {
        searchResult,
    };
};
