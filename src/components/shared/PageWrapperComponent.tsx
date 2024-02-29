"use client";
import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import { Box, Typography } from "@mui/joy";
import Head from "next/head";
import { useRouter } from "next/router";
import { useParams } from "next/navigation";

type Props = PropsWithChildren & {
    title?: string;
    subtitle?: string;
};

export const PageWrapperComponent: React.FC<Props> = (props) => {
    const { title, subtitle, children } = props;
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const resolveWindowTitleFromPathName = (pathname: string): string => {
        const charactersToExclude = ["/", "-", "\\", "[", "]"];
        let result = pathname === "/" ? "Startseite" : pathname.slice(1);

        charactersToExclude.forEach((character) => {
            if (!result.includes(character)) return;

            const cleanText = result
                .replaceAll(character, " ")
                .replace("id", id);

            result = cleanText.slice(0);
        });

        return `${result.charAt(0).toUpperCase()}${result.slice(1)}`;
    };

    return (
        <>
            <Head>
                <title>{`${resolveWindowTitleFromPathName(router.pathname)} - ${process.env.NEXT_PUBLIC_APPLICATION_NAME!}`}</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageHeaderContainer>
                {title || title ? (
                    <TitleAndSubtitleContainer>
                        <Typography level="h3">{title}</Typography>
                        <Typography level="title-sm">{subtitle}</Typography>
                    </TitleAndSubtitleContainer>
                ) : null}
                <Box>{children}</Box>
            </PageHeaderContainer>
        </>
    );
};

const PageHeaderContainer = styled(Box)``;

const TitleAndSubtitleContainer = styled(Box)`
    display: grid;
    gap: var(--gap-1);
    padding: 0 0 var(--gap-2) 0;
`;
