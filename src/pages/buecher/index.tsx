"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, {
    ComponentType,
    ReactNode,
    useState,
    useEffect,
    ChangeEvent,
} from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import styled from "styled-components";
import { Box, Button, IconButton, ButtonGroup, Input, Stack } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import { Buch, getAlleBuecherApi } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import {
    BookListComponent,
    BookListViewType,
} from "@/components/shared/BookListComponent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";

const BooksPage: React.FC = () => {
    const {
        data: buecher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", getAlleBuecherApi);

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
        <PageWrapperComponent title={"Bücher"}>
            <Stack direction="column" spacing={"var(--gap-4)"}>
                <BookSearchWrapper buecher={buecher} />
            </Stack>
        </PageWrapperComponent>
    );
};

type PropsBooksSearchWrapper = {
    buecher: Buch[];
    // eslint-disable-next-line no-unused-vars
    children?: (searchResult: Buch[]) => ReactNode;
};

const BookSearchWrapper: React.FC<PropsBooksSearchWrapper> = (
    props: PropsBooksSearchWrapper,
) => {
    const { buecher, children } = props;
    const [searchResult, setSearchResult] = useState<Buch[]>(buecher);
    const [inputValue, setInputValue] = useState<string>("");

    const [view, setView] = useState<BookListViewType>("CARD");

    useEffect(() => {
        setSearchResult(buecher);
    }, [buecher]);

    useEffect(() => {
        const searchBuchFromInputString = (
            queryString: string,
            buecherList: Buch[],
        ): Buch[] => {
            if (buecherList === undefined || queryString === "")
                return buecherList;

            const queryToLowercase = queryString.toLowerCase();

            return buecherList.filter((item) =>
                item.titel.toLowerCase().includes(queryToLowercase),
            );
        };

        const result = searchBuchFromInputString(inputValue, buecher);
        setSearchResult(result);
    }, [buecher, inputValue]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        setInputValue(event.target.value);
    };

    return (
        <>
            <FilterContainer>
                <Input
                    startDecorator={<SearchIcon fontSize="small" />}
                    placeholder="Suchen"
                    size="md"
                    value={inputValue}
                    onChange={handleChange}
                />
                <ViewSwitcherComponent view={view} setView={setView} />
            </FilterContainer>
            {searchResult.length === 0 ? (
                <Alert severity="warning">Keine Bücher gefunden.</Alert>
            ) : (
                <BookListComponent view={view} buecher={searchResult} />
            )}
            {children ? children(searchResult) : null}
        </>
    );
};

type ViewOption = {
    view: BookListViewType;
    title: string;
    icon: ComponentType<any>;
};
type PropsViewSwitch = {
    view: BookListViewType;
    // eslint-disable-next-line no-unused-vars
    setView: (view: BookListViewType) => void;
};
const ViewSwitcherComponent: React.FC<PropsViewSwitch> = (
    props: PropsViewSwitch,
) => {
    const { view, setView } = props;
    const { isSmall } = useMediaQuery();

    const viewOptions: ViewOption[] = [
        {
            view: "CARD",
            title: "Kartenansicht",
            icon: GridViewOutlinedIcon,
        },
        {
            view: "TABLE",
            title: "Tabellenansicht",
            icon: ViewListOutlinedIcon,
        },
        {
            view: "LIST",
            title: "Listenansicht",
            icon: FormatListBulletedOutlinedIcon,
        },
    ];

    return (
        <ButtonGroup sx={{ justifySelf: "end" }}>
            {isSmall ? (
                <>
                    {viewOptions.map((option) => (
                        <IconButton key={option.view}>
                            <option.icon
                                sx={{ padding: "5px" }}
                                fontSize="large"
                                color={
                                    view === option.view ? "primary" : "neutral"
                                }
                                onClick={() => setView(option.view)}
                            />
                        </IconButton>
                    ))}
                </>
            ) : (
                <>
                    {viewOptions.map((option) => (
                        <Button
                            key={option.view}
                            color={view === option.view ? "primary" : "neutral"}
                            variant={view === option.view ? "solid" : undefined}
                            onClick={() => setView(option.view)}
                        >
                            {option.title}
                        </Button>
                    ))}
                </>
            )}
        </ButtonGroup>
    );
};

const FilterContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    align-content: center;
    align-items: center;
`;

export default BooksPage;
