"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment, no-unused-vars */
import React, { ReactNode, useState, ChangeEvent } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import styled from "styled-components";
import { Box, Input, Stack } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import { Buch } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import {
    BookListComponent,
    BookListViewType,
} from "@/components/shared/BookListComponent";
import { useSearchBooks } from "@/hooks/useSearchBooks";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import { ViewSwitcherComponent } from "@/components/shared/ViewSwitcherComponent";

/**
 * React-Komponente für die Bücher-Übersichtsseite.
 */
const BooksPage: React.FC = () => {
    const appContext = useApplicationContextApi();

    /**
     * SWR-Hook zum Abrufen aller Bücher.
     */
    const {
        data: buecher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", appContext.getAlleBuecher);

    if (isLoading || buecher === undefined)
        return <LoadingComponent message="Bücher werden geladen..." />;

    if (error) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(error as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent title={"Bücher"}>
            <Stack direction="column" spacing={"var(--gap-4)"}>
                <BookSearchWrapper buecher={buecher} />
            </Stack>
        </PageWrapperComponent>
    );
};

type PropsBooksSearchWrapper = {
    buecher: Buch[];
    children?: (searchResult: Buch[]) => ReactNode;
};

/**
 * React-Komponente für die Buchsuch-Funktionalität.
 *
 */
const BookSearchWrapper: React.FC<PropsBooksSearchWrapper> = (
    props: PropsBooksSearchWrapper,
) => {
    const { buecher, children } = props;
    const [inputValue, setInputValue] = useState<string>("");
    const [view, setView] = useState<BookListViewType>("CARD");

    const { searchResult } = useSearchBooks({
        buecher,
        searchQuery: inputValue,
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        setInputValue(event.target.value);
    };

    return (
        <>
            <FilterContainer>
                <Input
                    startDecorator={<SearchIcon fontSize="small" />}
                    placeholder="Suchen"
                    size="md"
                    value={inputValue}
                    onChange={handleChange}
                />
                <ViewSwitcherComponent view={view} setView={setView} />
            </FilterContainer>
            {searchResult.length === 0 ? (
                <Alert severity="warning">Keine Bücher gefunden.</Alert>
            ) : (
                <BookListComponent view={view} buecher={searchResult} />
            )}
            {children ? children(searchResult) : null}
        </>
    );
};

const FilterContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    align-content: center;
    align-items: center;

    @media screen and (max-width: 900px) {
        grid-template-columns: 1fr;
        grid-gap: var(--gap-2);
    }
`;
export default BooksPage;
