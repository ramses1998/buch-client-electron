"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import {
    Card,
    Input,
    List,
    ListItem,
    ListItemButton,
    ListItemContent,
    ListItemDecorator,
    Stack,
    Typography,
} from "@mui/joy";
import { Buch } from "@/api/buch";
import SearchIcon from "@mui/icons-material/Search";
import useSWR from "swr";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { useSearchBooks } from "@/hooks/useSearchBooks";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";

const SearchInputComponent: React.FC = () => {
    const [inputValue, setInputValue] = useState<string>("");
    const [isSearchResultVisible, setIsSearchResultVisible] =
        useState<boolean>(false);
    const appContext = useApplicationContextApi();

    const { data: buecher, isLoading } = useSWR<Buch[]>(
        "getAll",
        appContext.getAlleBuecher,
    );

    const { searchResult } = useSearchBooks({
        buecher: buecher ?? [],
        searchQuery: inputValue,
    });

    useEffect(() => {
        const inputValueMatch = searchResult.find(
            (b) => b.titel === inputValue,
        );

        if (inputValue.length > 0 && !inputValueMatch) {
            setIsSearchResultVisible(true);
            return;
        }
        setIsSearchResultVisible(false);
        return () => setIsSearchResultVisible(false);
    }, [inputValue, searchResult]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        event?.preventDefault();
        setInputValue(event.target.value);
    };

    const handleClick = (buchTitle: string) => {
        setInputValue(buchTitle);
        setIsSearchResultVisible(false);
    };

    if (isLoading || buecher === undefined) return null;

    return (
        <Stack sx={{ position: "relative" }}>
            <Input
                startDecorator={<SearchIcon fontSize="small" />}
                placeholder="Suchen"
                size="md"
                value={inputValue}
                onChange={handleChange}
            />
            {isSearchResultVisible ? (
                <Card
                    sx={{
                        position: "absolute",
                        top: "120%",
                        width: "100%",
                        px: 0,
                        py: 0,
                    }}
                >
                    <List>
                        {searchResult.length === 0 ? (
                            <ListItem>
                                <Typography>Keine Bücher gefunden!</Typography>
                            </ListItem>
                        ) : (
                            searchResult.map((buch) => (
                                <ListItem
                                    key={buch.id}
                                    onClick={() => handleClick(buch.titel)}
                                >
                                    <ListItemButton
                                        sx={{
                                            px: "var(--gap-2)",
                                            py: "var(--gap-1)",
                                        }}
                                    >
                                        <ListItemDecorator>
                                            <AutoStoriesOutlinedIcon />
                                        </ListItemDecorator>
                                        <ListItemContent
                                            sx={{ fontSize: "sm" }}
                                        >
                                            <Stack
                                                direction={"row"}
                                                justifyContent={"space-between"}
                                                justifyItems={"space-between"}
                                            >
                                                <Typography>
                                                    {buch.titel}
                                                </Typography>
                                                <Typography level="body-sm">
                                                    {`${buch.preis}€`}
                                                </Typography>
                                            </Stack>
                                        </ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                            ))
                        )}
                    </List>
                </Card>
            ) : null}
        </Stack>
    );
};

export default SearchInputComponent;
