"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment */
import "@fontsource/inter";
import React, { useEffect, useState, useRef } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import useSWR from "swr";
import { Buch } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import styled from "styled-components";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import { BookCardComponent } from "@/components/shared/BookCardComponent";
import { useRouter } from "next/router";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import { RatingComponent } from "@/components/shared/RatingComponent";
import Divider from "@mui/joy/Divider";
import StopCircleOutlinedIcon from "@mui/icons-material/StopCircleOutlined";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import { v4 as uuid } from "uuid";

const MAX_BOOKS_COUNT_FOR_OVERVIEW = 4;
const MINIMUM_RATING_FOR_POPULAR_BOOK = 2;
const OVERVIEW_CARD_ANIMATION_DURATION = 3;
const MILISECOND_FACTOR = 1000;

const Home = () => {
    const appContext = useApplicationContextApi();
    const { data, isLoading, error } = useSWR<Buch[]>(
        "getAll",
        appContext.getAlleBuecher,
    );

    const router = useRouter();

    const resolveMostPopularBooks = (buecher: Buch[]): Buch[] => {
        return buecher.filter(
            (b) => b.rating >= MINIMUM_RATING_FOR_POPULAR_BOOK,
        );
    };

    const [buecher, setBuecher] = useState<Buch[] | undefined>(undefined);

    useEffect(() => {
        const buecherForStateUpdate = data?.slice(
            0,
            MAX_BOOKS_COUNT_FOR_OVERVIEW,
        );
        setBuecher(buecherForStateUpdate);
    }, [data]);

    const sortBooksByRating = (buecher: Buch[]): Buch[] => {
        return buecher.sort((a, b) => b.rating - a.rating);
    };

    const [isAnimating, setIsAnimating] = useState<boolean>(true);
    const animationDuration =
        OVERVIEW_CARD_ANIMATION_DURATION * MILISECOND_FACTOR;
    const overviewContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        toggleAnimation();
    }, []);

    useEffect(() => {
        if (!buecher) return;

        // eslint-disable-next-line no-undef
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

    const toggleAnimation = () => {
        setIsAnimating((prevAnimating) => !prevAnimating);
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
                    <OverviewContainerWithItemList
                        ref={overviewContainerRef}
                        animating={`${isAnimating}`}
                    >
                        {buecher.map((buch, index) => (
                            <OverviewCardComponent
                                key={uuid()}
                                buch={buch}
                                isMain={index === 0}
                                animating={isAnimating}
                            />
                        ))}
                    </OverviewContainerWithItemList>
                    <Button
                        variant="plain"
                        color="primary"
                        onClick={toggleAnimation}
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

type PropsOverviewCard = {
    buch: Buch;
    isMain: boolean;
    animating: boolean;
};
// eslint-disable-next-line react/display-name
const OverviewCardComponent = (props: PropsOverviewCard) => {
    const { buch, isMain, animating } = props;
    const router = useRouter();

    const description =
        buch.art === "DRUCKAUSGABE"
            ? "Genießen Sie das Gefühl der Seiten und die einzigartige Erfahrung, ein physisches Buch zu lesen."
            : "Genießen Sie die praktische Tragbarkeit und den sofortigen Zugriff auf Tausende von Titeln.";

    return (
        <CardContainer ismain={`${isMain}`} animating={`${animating}`}>
            <CardContent ismain={`${isMain}`}>
                <CustomChipComponent value={`${buch.preis.toFixed(2)} €`} />
                <TitleUndInfoContainer>
                    <BuchTitle ismain={`${isMain}`} noWrap={!isMain}>
                        {buch.titel}
                    </BuchTitle>
                    <Stack
                        direction="row"
                        sx={{ justifySelf: "start" }}
                        spacing="var(--gap-1)"
                    >
                        <RatingComponent stars={buch.rating} />
                        {isMain ? (
                            <>
                                <Divider orientation="vertical" />
                                <Typography level="title-sm">
                                    {`${buch.lieferbar ? "Lieferbar" : "Nicht lieferbar"}`}
                                </Typography>
                                <Divider orientation="vertical" />
                                <Typography level="title-sm">
                                    {`${(buch.rabatt * 100).toFixed(1)} % Rabatt`}
                                </Typography>
                            </>
                        ) : null}
                    </Stack>
                </TitleUndInfoContainer>
                {isMain ? (
                    <Typography level="title-md">{description}</Typography>
                ) : null}
                <Button
                    size="sm"
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

const OverviewContainerWithItemList = styled(Card)<{
    animating: "true" | "false";
}>`
    display: grid;
    grid-gap: var(--gap-2);
    grid-template-columns: minmax(500px, 1fr) repeat(
            ${MAX_BOOKS_COUNT_FOR_OVERVIEW - 1},
            minmax(250px, 300px)
        );
    background: transparent;
    padding: var(--gap-1) 30px 0 2px;
    border: none;
    overflow-y: hidden;
    overflow-x: hidden;
    height: 480px;
`;

const CardContainer = styled(Card)<{
    ismain: "true" | "false";
    animating: "true" | "false";
}>`
    height: 450px;
    border-radius: var(--gap-1);
    padding: var(--gap-10) var(--gap-3) var(--gap-3) var(--gap-3);
    box-shadow: 0 0 5px grey;
    animation: ${(props) =>
        props.ismain === "false" && props.animating === "true"
            ? `backwardSlide ${OVERVIEW_CARD_ANIMATION_DURATION}s cubic-bezier(0.1, 0.7, 1, 0.1)`
            : "unset"};
    animation-iteration-count: infinite;

    @keyframes backwardSlide {
        from {
            transform: translateX(10%);
        }
        to {
            transform: translateX(0);
        }
    }
`;

const CardContent = styled(Box)<{ ismain: "true" | "false" }>`
    display: grid;
    justify-content: start;
    justify-items: start;
    grid-gap: var(--gap-2);
    max-width: ${(props) => (props.ismain === "true" ? "90%" : "unset")};
`;

const TitleUndInfoContainer = styled(Stack)`
    display: grid;
    grid-gap: var(--gap-1);
    width: 90%;
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
