// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { Buch } from "@/http/buch";
import styled from "styled-components";
import { Box } from "@mui/joy";
import { BookCardComponent } from "@/components/shared/BookCardComponent";
import BookTableComponent from "@/components/BookTableComponent";
import { BookListViewComponent } from "@/components/BookListViewComponent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useRouter } from "next/router";

export type BookListViewType = "CARD" | "TABLE" | "LIST";

type Props = {
    buecher: Buch[];
    view: BookListViewType;
};

export const BookListComponent: React.FC<Props> = (props) => {
    const { buecher, view } = props;

    switch (view) {
        case "CARD":
            return <BookListCardViewComponent buecher={buecher} />;
        case "TABLE":
            return <BookTableComponent buecher={buecher} />;
        case "LIST":
            return <BookListViewComponent buecher={buecher} />;
        default:
            return <BookListViewComponent buecher={buecher} />;
    }
};

type PropsBookListCardView = {
    buecher: Buch[];
};
const BookListCardViewComponent: React.FC<PropsBookListCardView> = (
    props: PropsBookListCardView,
) => {
    const { buecher } = props;
    const { isSmall } = useMediaQuery();
    const router = useRouter();

    return (
        <BookCardListContainer issmall={`${isSmall}`}>
            {buecher.map((buch) => (
                <BookCardComponent
                    key={buch.id}
                    buch={buch}
                    onClick={() => router.push(`/buecher/${buch.id}`)}
                />
            ))}
        </BookCardListContainer>
    );
};

const BookCardListContainer = styled(Box)<{ issmall: "true" | "false" }>`
    display: grid;
    gap: calc(var(--gap-3) + 7px);
    grid-template-columns: repeat(
        ${(props) => (props.issmall === "true" ? 2 : 6)},
        1fr
    );
`;
