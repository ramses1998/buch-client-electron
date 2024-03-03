import React from "react";
import { Buch } from "@/api/buch";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import { Box, Card, Typography } from "@mui/joy";
import styled from "styled-components";
import { RatingComponent } from "@/components/shared/RatingComponent";

const WIDTH_OF_BOOK_CARD_CONTAINER = "230px";
const HEIGHT_OF_BOOK_CARD_CONTAINER = "300px";

type Props = {
    buch: Buch;
    onClick?: () => void;
};

export const BookCardComponent: React.FC<Props> = (props) => {
    const { buch, onClick } = props;

    return (
        <BookCardWrapper
            clickable={onClick ? "true" : "false"}
            onClick={onClick}
        >
            <BookCardContainer clickable={onClick ? "true" : "false"}>
                <CardContent>
                    <CustomChipComponent value={`${buch.preis.toFixed(2)} €`} />
                    <BuchTitle>{buch.titel}</BuchTitle>
                </CardContent>
            </BookCardContainer>
            <BookInfoContainer>
                <Typography level="title-sm">
                    {buch.lieferbar ? "Lieferbar" : "Nicht lieferbar"}
                </Typography>
                <RatingComponent stars={buch.rating} />
            </BookInfoContainer>
        </BookCardWrapper>
    );
};

const BookCardWrapper = styled(Box)<{ clickable: "true" | "false" }>`
    display: grid;
    gap: var(--gap-2);
    justify-content: center;
    justify-items: center;
    cursor: ${(props) => (props.clickable === "true" ? "pointer" : "unset")};
`;

const BookCardContainer = styled(Card)<{ clickable: "true" | "false" }>`
    height: ${HEIGHT_OF_BOOK_CARD_CONTAINER};
    width: ${WIDTH_OF_BOOK_CARD_CONTAINER};
    border-radius: 10px;
    padding-top: 35%;
    border: ${(props) =>
        props.clickable === "true" ? "2px solid transparent" : "unset"};

    &:hover {
        border: ${(props) =>
            props.clickable === "true"
                ? "2px solid var(--color-main)"
                : "unset"};
        box-shadow: ${(props) =>
            props.clickable === "true" ? "0 0 20px grey" : "unset"};
    }
`;

const CardContent = styled(Box)`
    display: grid;
    justify-content: start;
    justify-items: start;
    grid-gap: var(--gap-2);
`;

const BuchTitle = styled(Typography)<{ isMain?: boolean }>`
    display: inline-block;
    width: 90%;
    font-weight: 500;
    font-size: var(--font-normal-size);
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
`;

const BookInfoContainer = styled(Box)`
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--gap-2);
    padding: 0 var(--gap-1) 0 var(--gap-1);
    width: ${WIDTH_OF_BOOK_CARD_CONTAINER};

    /* zweites Element(Kind) des BookInfoContainers wird rechtsbündig ausgerichtet */
    &:nth-child(2n) {
        justify-self: end;
    }
`;
