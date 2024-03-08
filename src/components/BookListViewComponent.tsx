"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { Buch } from "@/api/buch";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Box, Stack, Typography } from "@mui/joy";
import { RatingComponent } from "@/components/shared/RatingComponent";
import Divider from "@mui/joy/Divider";
import { SxProps } from "@mui/joy/styles/types";

type Props = {
    buecher: Buch[];
};

/**
 * React-Komponente für eine Listenansicht von Büchern.
 *
 * @param props - Eigenschaften der Komponente.
 */
export const BookListViewComponent: React.FC<Props> = (props) => {
    const { buecher } = props;
    const router = useRouter();

    /**
     * SxProps für responsives Ein- und Ausblenden der MUI-Komponente.
     *
     * Wird nur auf größeren Bildschirmen (lg und größer) angezeigt.
     *
     * @see https://mui.com/material-ui/customization/breakpoints
     *
     */
    const hideOnSmallScreen: SxProps = {
        display: {
            lg: "block",
            md: "none",
            sm: "none",
            xs: "none",
        },
    };

    return (
        <Stack direction="column" spacing={"var(--gap-2)"}>
            {buecher.map((buch) => (
                <BookItemContainer
                    key={buch.id}
                    onClick={() => router.push(`/buecher/${buch.id}`)}
                >
                    <BookTitleAndPreviewInfo>
                        <Typography component="p" level={"title-lg"}>
                            {buch.titel}
                        </Typography>
                        <Stack direction="row" spacing={"var(--gap-1)"}>
                            <Typography level={"body-sm"} component="p">
                                {buch.isbn}
                            </Typography>
                            <Divider orientation="vertical" />
                            <RatingComponent stars={buch.rating} />
                            <Divider
                                orientation="vertical"
                                sx={hideOnSmallScreen}
                            />
                            <Typography
                                level={"body-sm"}
                                component="p"
                                sx={hideOnSmallScreen}
                            >
                                {buch.art}
                            </Typography>
                            <Divider
                                orientation="vertical"
                                sx={hideOnSmallScreen}
                            />
                            <Typography
                                level={"body-sm"}
                                component="p"
                                sx={hideOnSmallScreen}
                            >
                                {buch.homepage}
                            </Typography>
                            <Divider
                                orientation="vertical"
                                sx={hideOnSmallScreen}
                            />
                            <Typography
                                level={"body-sm"}
                                component="p"
                                sx={hideOnSmallScreen}
                            >
                                {buch.lieferbar
                                    ? "Lieferbar"
                                    : "Nicht lieferbar"}
                            </Typography>
                        </Stack>
                    </BookTitleAndPreviewInfo>
                    <Typography component="p" level={"title-lg"}>
                        {`${buch.preis} €`}
                    </Typography>
                </BookItemContainer>
            ))}
        </Stack>
    );
};

const BookItemContainer = styled(Box)`
    display: grid;
    grid-gap: var(--gap-2);
    grid-template-columns: 1fr max-content;
    align-content: center;
    align-items: center;
    background-color: white;
    border-radius: var(--border-small);
    box-shadow: 0 0 2px grey;
    padding: var(--gap-2);
    cursor: pointer;
    border: 2px solid transparent;
    &:hover {
        border: 2px solid var(--color-main);
        box-shadow: 0 0 10px grey;
    }
`;
const BookTitleAndPreviewInfo = styled(Box)`
    display: grid;
    grid-gap: 5px;
    align-content: center;
    align-items: center;
`;
