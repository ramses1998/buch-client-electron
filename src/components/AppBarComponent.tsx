"use client";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Box, Button, ButtonGroup, Sheet, Stack, Typography } from "@mui/joy";
import dynamic from "next/dynamic";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useRouter } from "next/router";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// So kann der Hydration-Fehler vermieden werden.
const SearchInputComponent = dynamic(
    () => import("../components/shared/SearchInputComponent"),
    { ssr: false },
);

const MAX_WIDTH_OF_SEARCH_INPUT_FIELD = "700px";

export const AppBarComponent: React.FC = () => {
    const router = useRouter();

    const [isBrowserHistoryEmpty, setIsBrowserHistoryEmpty] =
        useState<boolean>(true);
    const { isSmall } = useMediaQuery();

    useEffect(() => {
        if (window.history && window.history.length > 1) {
            setIsBrowserHistoryEmpty(false);
            return;
        }
        setIsBrowserHistoryEmpty(true);
    }, [router]);

    return (
        <NavigationBarContainer>
            <Stack direction="row" spacing="var(--gap-1)">
                <Box
                    component="img"
                    src="/logo.svg"
                    alt="logo"
                    sx={{
                        height: 25,
                        objectFit: "cover",
                    }}
                />
                {isSmall ? null : (
                    <Typography component="p" level="title-md">
                        {process.env.NEXT_PUBLIC_APPLICATION_NAME!}
                    </Typography>
                )}
            </Stack>
            <SearchInputContainer>
                <ButtonGroup size="sm">
                    <Button
                        color="primary"
                        variant="plain"
                        size={"sm"}
                        startDecorator={<ArrowBackOutlinedIcon />}
                        disabled={isBrowserHistoryEmpty}
                        onClick={() => router.back()}
                    >
                        {isSmall ? "" : "Zurück"}
                    </Button>
                </ButtonGroup>
                <SearchInputComponent />
            </SearchInputContainer>
        </NavigationBarContainer>
    );
};

const NavigationBarContainer = styled(Sheet)`
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    grid-gap: var(--gap-2);
    align-content: center;
    align-items: center;
    padding: var(--gap-2);
    height: 100%;
`;

const SearchInputContainer = styled(Box)`
    display: flex;
    grid-template-columns: auto 1fr;
    gap: var(--gap-1);
    width: 100%;
    max-width: ${MAX_WIDTH_OF_SEARCH_INPUT_FIELD};
    justify-self: center;
`;
