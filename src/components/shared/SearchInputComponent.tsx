"use client";
import React from "react";
import { Input } from "@mui/joy";
import SearchIcon from "@mui/icons-material/Search";

export const SearchInputComponent: React.FC = () => {
    // TODO: Implement search hier
    return (
        <Input
            startDecorator={<SearchIcon fontSize="small" />}
            placeholder="Suchen"
            size="md"
        />
    );
};
