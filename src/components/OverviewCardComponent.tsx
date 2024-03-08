// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
"use client";
import { Buch } from "@/api/buch";
import { useRouter } from "next/router";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import { Box, Button, Card, Stack, Typography } from "@mui/joy";
import { RatingComponent } from "@/components/shared/RatingComponent";
import Divider from "@mui/joy/Divider";
import React from "react";
import styled from "styled-components";

type Props = {
    buch: Buch;
    isMain: boolean;
    animating: boolean;
    animationDuration: number;
};

/**
 * React-Komponente für eine Karte in der Übersicht.
 *
 * @param props - Eigenschaften der Komponente.
 */
export const OverviewCardComponent = (props: Props) => {
    const { buch, isMain, animating, animationDuration } = props;
    const router = useRouter();

    /**
     * Beschreibung des Buches, abhängig vom der Art.
     */
    const description =
        buch.art === "DRUCKAUSGABE"
            ? "Genießen Sie das Gefühl der Seiten und die einzigartige Erfahrung, ein physisches Buch zu lesen."
            : "Genießen Sie die praktische Tragbarkeit und den sofortigen Zugriff auf Tausende von Titeln.";

    return (
        <CardContainer
            ismain={isMain ? "true" : "false"}
            animating={animating ? "true" : "false"}
            animationduration={`${animationDuration}`}
        >
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

const CardContainer = styled(Card)<{
    ismain: "true" | "false";
    animating: "true" | "false";
    animationduration: string;
}>`
    height: 450px;
    border-radius: var(--gap-1);
    padding: var(--gap-10) var(--gap-3) var(--gap-3) var(--gap-3);
    box-shadow: 0 0 5px grey;
    animation: ${(props) =>
        props.ismain === "false" && props.animating === "true"
            ? `backwardSlide ${props.animationduration}s cubic-bezier(0.1, 0.7, 1, 0.1)`
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
