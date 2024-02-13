"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { Buch } from "@/api/buch";
import { useRouter } from "next/router";
import styled from "styled-components";
import { Box, Stack, Typography } from "@mui/joy";

type Props = {
    buecher: Buch[];
};

export const BookListViewComponent: React.FC<Props> = (props) => {
    const { buecher } = props;
    const router = useRouter();

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
                        <Typography component="p" level={"body-sm"}>
                            {`${buch.isbn}  |  ${buch.art}  |  ${buch.homepage}`}
                        </Typography>
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
`;
const BookTitleAndPreviewInfo = styled(Box)`
    display: grid;
    grid-gap: 5px;
    align-content: center;
    align-items: center;
`;
