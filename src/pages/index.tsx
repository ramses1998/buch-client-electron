"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment */
import "@fontsource/inter";
import React from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import useSWR from "swr";
import { Buch } from "@/http/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import styled from "styled-components";
import { CustomBadgeComponent } from "@/components/shared/CustomBadgeComponent";
import { BookCardComponent } from "@/components/shared/BookCardComponent";
import { useRouter } from "next/router";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";

const MAX_BOOKS_COUNT_FOR_OVERVIEW = 4;
const MINIMUM_RATING_FOR_POPULAR_BOOK = 2;

const Home = () => {
    const appContext = useApplicationContextApi();
    const {
        data: buecher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", appContext.getAlleBuecher);
    const router = useRouter();

    const resolveMostPopularBooks = (buecher: Buch[]): Buch[] => {
        return buecher.filter(
            (b) => b.rating >= MINIMUM_RATING_FOR_POPULAR_BOOK,
        );
    };

    const sortBooksByRating = (buecher: Buch[]): Buch[] => {
        return buecher.sort((a, b) => b.rating - a.rating);
    };

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
        <PageWrapperComponent>
            <Stack direction="column" spacing={"var(--gap-7)"}>
                <OverviewContainerWithItemList>
                    {buecher
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
                        <Button
                            variant="plain"
                            onClick={() => router.push("/buecher")}
                        >
                            Alle Bücher
                        </Button>
                    </Stack>
                    <ListContainer>
                        {sortBooksByRating(
                            resolveMostPopularBooks(buecher),
                        ).map((buch, index) => (
                            <BookCardComponent
                                key={index}
                                buch={buch}
                                onClick={() =>
                                    router.push(`/buecher/${buch.id}`)
                                }
                            />
                        ))}
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
    const router = useRouter();

    const description =
        buch.art === "DRUCKAUSGABE"
            ? "Genießen Sie das Gefühl der Seiten und die einzigartige Erfahrung, ein physisches Buch zu lesen."
            : "Genießen Sie die praktische Tragbarkeit und den sofortigen Zugriff auf Tausende von Titeln.";

    return (
        <CardContainer ismain={`${isMain}`}>
            <CardContent ismain={`${isMain}`}>
                <CustomBadgeComponent value={`${buch.preis} €`} />
                <BuchTitle ismain={`${isMain}`} noWrap={!isMain}>
                    {buch.titel}
                </BuchTitle>
                {isMain ? (
                    <Typography level="title-md">{description}</Typography>
                ) : null}
                <Button
                    size="lg"
                    variant="solid"
                    sx={{ width: "170px" }}
                    onClick={() => router.push(`/buecher/${buch.id}`)}
                >
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

const CardContainer = styled(Card)<{ ismain: "true" | "false" }>`
    height: ${(props) => (props.ismain === "true" ? "450px" : "unset")};
    border-radius: var(--gap-1);
    padding: var(--gap-10) var(--gap-3) var(--gap-3) var(--gap-3);
    box-shadow: 0 0 5px grey;
`;

const CardContent = styled(Box)<{ ismain: "true" | "false" }>`
    display: grid;
    justify-content: start;
    justify-items: start;
    grid-gap: var(--gap-2);
    max-width: ${(props) => (props.ismain === "true" ? "90%" : "unset")};
`;

const BuchTitle = styled(Typography)<{ ismain: "true" | "false" }>`
    display: inline-block;
    width: 90%;
    line-height: ${(props) => (props.ismain === "true" ? "40px" : "unset")};
    font-weight: bold;
    word-break-wrap: ${(props) =>
        props.ismain === "true" ? "break-all" : "unset"};
    font-size: ${(props) =>
        props.ismain === "true"
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
