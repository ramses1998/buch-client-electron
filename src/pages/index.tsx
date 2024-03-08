"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment, no-undef */
import "@fontsource/inter";
import React, { useEffect, useState } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import useSWR from "swr";
import { Buch } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import styled from "styled-components";
import { BookCardComponent } from "@/components/shared/BookCardComponent";
import { useRouter } from "next/router";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import { v4 as uuid } from "uuid";
import { OverviewCardComponent } from "@/components/OverviewCardComponent";

const MAX_BOOKS_COUNT_FOR_OVERVIEW = 4;
const MINIMUM_RATING_FOR_POPULAR_BOOK = 2;
const OVERVIEW_CARD_ANIMATION_DURATION = 3;
const MILLISECOND_FACTOR = 1000;

/**
 * React-Komponente für die Startseite.
 */
const Home: React.FC = () => {
    const appContext = useApplicationContextApi();
    const [buecher, setBuecher] = useState<Buch[] | undefined>(undefined);
    const [isAnimating, setIsAnimating] = useState<boolean>(true);
    const router = useRouter();

    const { data, isLoading, error } = useSWR<Buch[]>(
        "getAll",
        appContext.getAlleBuecher,
    );

    const animationDuration =
        OVERVIEW_CARD_ANIMATION_DURATION * MILLISECOND_FACTOR;

    useEffect(() => {
        const buecherForStateUpdate = data?.slice(
            0,
            MAX_BOOKS_COUNT_FOR_OVERVIEW,
        );
        setBuecher(buecherForStateUpdate);
    }, [data]);

    useEffect(() => {
        if (!buecher) return;

        let intervalId: NodeJS.Timeout | undefined = undefined;

        if (isAnimating) {
            intervalId = setInterval(() => {
                setBuecher((prevState) => {
                    if (!prevState) return;
                    const [erstesBuch, ...rest] = prevState;
                    return [...rest, erstesBuch];
                });
            }, animationDuration);
        }
        return () => clearInterval(intervalId);
    }, [isAnimating, data, buecher, animationDuration]);

    const resolveMostPopularBooks = (buecher: Buch[]): Buch[] => {
        return buecher.filter(
            (b) => b.rating >= MINIMUM_RATING_FOR_POPULAR_BOOK,
        );
    };

    const sortBooksByRating = (buecher: Buch[]): Buch[] => {
        return buecher.sort((a, b) => b.rating - a.rating);
    };

    if (isLoading || data === undefined || buecher === undefined)
        return <LoadingComponent message="Bücher werden geladen..." />;

    if (error) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(error as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent title="Startseite">
            <Stack direction="column" spacing={"var(--gap-7)"}>
                <Box>
                    <OverviewContainerWithItemList>
                        {buecher.map((buch, index) => (
                            <OverviewCardComponent
                                key={uuid()}
                                buch={buch}
                                isMain={index === 0}
                                animating={isAnimating}
                                animationDuration={
                                    OVERVIEW_CARD_ANIMATION_DURATION
                                }
                            />
                        ))}
                    </OverviewContainerWithItemList>
                    <Button
                        variant="plain"
                        color="primary"
                        onClick={() =>
                            setIsAnimating((prevAnimating) => !prevAnimating)
                        }
                        startDecorator={
                            isAnimating ? (
                                <StopCircleOutlinedIcon />
                            ) : (
                                <PlayCircleFilledWhiteOutlinedIcon />
                            )
                        }
                    >
                        {isAnimating
                            ? "Animation stoppen"
                            : "Animation starten"}
                    </Button>
                </Box>
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
                        {sortBooksByRating(resolveMostPopularBooks(data)).map(
                            (buch, index) => (
                                <BookCardComponent
                                    key={index}
                                    buch={buch}
                                    onClick={() =>
                                        router.push(`/buecher/${buch.id}`)
                                    }
                                />
                            ),
                        )}
                    </ListContainer>
                </Stack>
            </Stack>
        </PageWrapperComponent>
    );
};

const OverviewContainerWithItemList = styled(Card)`
    display: grid;
    grid-gap: var(--gap-2);
    grid-template-columns: minmax(500px, 1fr) repeat(
            ${MAX_BOOKS_COUNT_FOR_OVERVIEW - 1},
            minmax(250px, 300px)
        );
    background: transparent;
    padding: var(--gap-1) var(--gap-3) 0 2px;
    border: none;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 480px;
`;

const ListContainer = styled(Box)`
    display: flex;
    gap: var(--gap-4);
    padding: var(--gap-2) 0;
    overflow-x: auto;
`;
export default Home;
