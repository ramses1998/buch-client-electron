import React from "react";
import styled from "styled-components";
import { Box, Sheet, Typography } from "@mui/joy";
import { SearchInputComponent } from "@/components/shared/SearchInputComponent";

const MAX_WIDTH_OF_SEARCH_INPUT_FIELD = "500px";

export const AppBarComponent: React.FC = () => {
    return (
        <NavigationBarContainer>
            <Typography component="p" level="title-md">
                HKA Bücher
            </Typography>
            <SearchInputContainer>
                <SearchInputComponent />
            </SearchInputContainer>
            <div></div>
        </NavigationBarContainer>
    );
};

const NavigationBarContainer = styled(Sheet)`
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    align-content: center;
    align-items: center;
    padding: var(--gap-3);
    height: 100%;
`;

const SearchInputContainer = styled(Box)`
    width: 100%;
    max-width: ${MAX_WIDTH_OF_SEARCH_INPUT_FIELD};
    justify-self: center;
`;
