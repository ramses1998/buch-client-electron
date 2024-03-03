import { Buch } from "@/api/buch";
import { useEffect, useState } from "react";

type Input = {
    searchQuery: string;
    buecher: Buch[];
};

type Output = {
    searchResult: Buch[];
};

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
