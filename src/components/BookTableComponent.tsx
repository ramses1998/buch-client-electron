// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/no-misused-promises */
"use client";
import React, { PropsWithChildren } from "react";
import Table from "@mui/joy/Table";
import { Box, Theme, useTheme } from "@mui/joy";
import Stack from "@mui/joy/Stack";
import { Buch } from "@/api/buch";
import { useRouter } from "next/router";
import { RatingComponent } from "@/components/shared/RatingComponent";
import { CustomBadgeComponent } from "@/components/shared/CustomBadgeComponent";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import styled from "styled-components";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import Alert from "@mui/material/Alert";

type Props = {
    buecher: Buch[];
};

const BookTableComponent: React.FC<Props> = (props: Props) => {
    const { buecher } = props;
    const router = useRouter();
    const { isLarge } = useMediaQuery();
    const theme = useTheme();

    const formatBooksToShow = (buecher: Buch[]) => {
        return buecher.map((buch) => ({
            ...buch,
            preis: `${buch.preis} €`,
            rating: <RatingComponent stars={buch.rating} />,
            schlagwoerter: (
                <Stack direction="row" spacing={"var(--gap-1)"}>
                    {buch.schlagwoerter?.map((w) => (
                        <CustomBadgeComponent key={w} value={w} />
                    ))}
                </Stack>
            ),
        }));
    };

    if (buecher.length === 0) {
        return <Alert severity="warning">Keine Bücher vorhanden.</Alert>;
    }

    return (
        <TableComponent
            size="md"
            variant="outlined"
            aria-label="Büchertabelle"
            noWrap
            stickyHeader
        >
            <TableHeadComponent component="thead">
                <TableHeadRowComponent component="tr" theme={theme}>
                    {isLarge && (
                        <TableHeadCellForBookIconComponent component="th" />
                    )}
                    <Box component="th">Titel</Box>
                    {isLarge && <Box component="th">Isbn</Box>}
                    {isLarge && <Box component="th">Art</Box>}
                    <Box component="th">Bewertung</Box>
                    <Box component="th">Preis</Box>
                    {isLarge && <Box component="th">Schlagwoerter</Box>}
                </TableHeadRowComponent>
            </TableHeadComponent>
            <TableBodyComponent component="tbody">
                {formatBooksToShow(buecher).map((buch) => (
                    <TableRow
                        key={buch.id}
                        onClick={() => router.push(`/buecher/${buch.id}`)}
                    >
                        <Box component="td">{buch.titel}</Box>
                        {isLarge && <Box component="td">{buch.isbn}</Box>}
                        {isLarge && <Box component="td">{buch.art}</Box>}
                        <Box component="td">{buch.rating}</Box>
                        <Box component="td">{buch.preis}</Box>
                        {isLarge && (
                            <Box component="td">{buch.schlagwoerter}</Box>
                        )}
                    </TableRow>
                ))}
            </TableBodyComponent>
        </TableComponent>
    );
};

type PropsTableRow = PropsWithChildren & {
    onClick: () => void;
};
const TableRow: React.FunctionComponent<PropsTableRow> = (
    props: PropsTableRow,
) => {
    const { isLarge } = useMediaQuery();
    const theme = useTheme();

    return (
        <TableRowComponent theme={theme} component="tr" onClick={props.onClick}>
            {isLarge && (
                <Box component="td">
                    <AutoStoriesOutlinedIcon />
                </Box>
            )}
            {props.children}
        </TableRowComponent>
    );
};

const TableComponent = styled(Table)`
    border-radius: var(--border-medium);
    box-shadow: 0 0 3px grey;
`;
const TableHeadComponent = styled(Box)`
    & tr > th:first-of-type {
        border-radius: 0.8em 0 0 0;
    }
    & tr > th:last-child {
        border-radius: 0 0.95em 0 0;
    }
`;
const TableHeadRowComponent = styled(Box)<{ theme: Theme }>`
    border-radius: 0.8em 0.8em 0 0;
    & th {
        padding-left: var(--gap-1);
        background-color: ${(props) => props.theme.palette.primary["50"]};
    }
`;
const TableHeadCellForBookIconComponent = styled(Box)`
    width: 5%;
    height: 50px;
    margin-left: var(--border-medium);
`;
const TableBodyComponent = styled(Box)`
    & tr:last-child td:first-of-type {
        border-radius: 0 0 0 0.8em;
    }
    & tr:last-child td:last-child {
        border-radius: 0 0 0.8em 0;
    }
    background-color: white;
`;
const TableRowComponent = styled(Box)<{ theme: Theme }>`
    &:hover {
        cursor: pointer;
        background-color: ${(props) => props.theme.palette.primary["100"]};
    }
    & td {
        padding: var(--gap-1) var(--gap-2) var(--gap-1) var(--gap-1);
    }
`;

export default BookTableComponent;
