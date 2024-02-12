"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@fontsource/inter";
import React from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import useSWR from "swr";
import { Buch, getAlleBuecherApi } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import styled from "styled-components";
import { PriceBadgeComponent } from "@/components/shared/PriceBadgeComponent";
import { BookCardComponent } from "@/components/shared/BookCardComponent";

const MAX_BOOKS_COUNT_FOR_OVERVIEW = 4;
const MINIMUM_RATING_FOR_POPULAR_BOOK = 2.5;

const Home = () => {
    const {
        data: bucher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", getAlleBuecherApi);

    const resolveMostPopularBooks = (buecher: Buch[]): Buch[] => {
        return buecher.filter(
            (b) => b.rating > MINIMUM_RATING_FOR_POPULAR_BOOK,
        );
    };

    const sortBooksByRating = (buecher: Buch[]): Buch[] => {
        return buecher.sort((a, b) => b.rating - a.rating);
    };

    if (isLoading || bucher === undefined)
        return <LoadingComponent message="Bücher werden geladen..." />;

    if (error) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(error as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent>
            <Stack direction="column" spacing={"var(--gap-7)"}>
                <OverviewContainerWithItemList>
                    {bucher
                        .slice(0, MAX_BOOKS_COUNT_FOR_OVERVIEW)
                        .map((buch, index) => (
                            <OverviewCardComponent
                                key={`${index}${buch.titel}`}
                                buch={buch}
                                isMain={index === 0}
                            />
                        ))}
                </OverviewContainerWithItemList>
                <Stack
                    direction="column"
                    spacing={"var(--gap-3)"}
                    justifyItems={"space-between"}
                    justifyContent={"space-between"}
                >
                    <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        justifyItems={"space-between"}
                    >
                        <Typography level="h3">Beliebsteste Bücher</Typography>
                        <Button variant="plain">Alle Bücher</Button>
                    </Stack>
                    <ListContainer>
                        {sortBooksByRating(resolveMostPopularBooks(bucher)).map(
                            (buch, index) => (
                                <BookCardComponent key={index} buch={buch} />
                            ),
                        )}
                    </ListContainer>
                </Stack>
            </Stack>
        </PageWrapperComponent>
    );
};

type PropsOverviewCard = {
    buch: Buch;
    isMain: boolean;
};
const OverviewCardComponent: React.FC<PropsOverviewCard> = (
    props: PropsOverviewCard,
) => {
    const { buch, isMain } = props;

    return (
        <CardContainer isMain={isMain}>
            <CardContent isMain={isMain}>
                <PriceBadgeComponent value={buch.preis} />
                <BuchTitle isMain={isMain} noWrap={!isMain}>
                    {buch.titel}
                </BuchTitle>
                {isMain ? <Typography>{buch.untertitel}</Typography> : null}
                <Button size="lg" variant="solid">
                    Buch einsehen
                </Button>
            </CardContent>
        </CardContainer>
    );
};

const OverviewContainerWithItemList = styled(Box)`
    display: grid;
    grid-gap: var(--gap-2);
    grid-template-columns: minmax(500px, 1fr) repeat(3, minmax(250px, 300px));
    background: transparent;
    overflow-x: auto;
    padding: var(--gap-1) 2px;
`;

const CardContainer = styled(Card)<{ isMain: boolean }>`
    height: ${(props) => (props.isMain ? "450px" : "unset")};
    border-radius: var(--gap-1);
    padding: var(--gap-10) var(--gap-3) var(--gap-3) var(--gap-3);
    box-shadow: 0 0 5px grey;
`;

const CardContent = styled(Box)<{ isMain?: boolean }>`
    display: grid;
    justify-content: start;
    justify-items: start;
    grid-gap: var(--gap-2);
    max-width: ${(props) => (props.isMain ? "100px" : "unset")};
`;

const BuchTitle = styled(Typography)<{ isMain?: boolean }>`
    display: inline-block;
    width: 90%;
    line-height: ${(props) => (props.isMain ? "40px" : "unset")};
    font-weight: bold;
    word-break-wrap: ${(props) => (props.isMain ? "break-all" : "unset")};
    font-size: ${(props) =>
        props.isMain
            ? "var(--font-extra-large-size)"
            : "var(--font-large-size)"};
`;

const ListContainer = styled(Box)`
    display: flex;
    gap: var(--gap-4);
    padding: var(--gap-2) 0;
    overflow-x: auto;
`;

export default Home;
