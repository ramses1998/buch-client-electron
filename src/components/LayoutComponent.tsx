"use client";
import React, { PropsWithChildren } from "react";
import { Box } from "@mui/joy";
import styled from "styled-components";
import { AppBarComponent } from "@/components/AppBarComponent";
import { SidebarComponent } from "@/components/SidebarComponent";

/**
 * Typ-Alias für die Eigenschaften der `LayoutComponent`.
 *
 * Erbt von `PropsWithChildren`, welches die Kinder-Komponenten beinhaltet.
 */
type Props = PropsWithChildren;

/**
 * React-Komponente fürs Layout der Anwendung.
 *
 * @param props - Eigenschaften der Komponente.
 */
export const LayoutComponent: React.FC<Props> = (props: PropsWithChildren) => {
    const { children } = props;

    return (
        <ApplicationMainContainer>
            <StickyContainer zindex={10000}>
                <AppBarComponent />
            </StickyContainer>
            <SidebarAndMainContentContainer>
                <StickyContainer>
                    <SidebarComponent />
                </StickyContainer>
                <MainBoxContainer component="main">{children}</MainBoxContainer>
            </SidebarAndMainContentContainer>
        </ApplicationMainContainer>
    );
};

const ApplicationMainContainer = styled(Box)`
    display: grid;
    grid-template-rows: 7vh 93vh;
    grid-gap: 4px;
    overflow-y: hidden;

    @media screen and (max-height: 700px) {
        grid-template-rows: 10vh 90vh;
    }
`;

const StickyContainer = styled(Box)<{ zindex?: number }>`
    position: sticky;
    top: 0;
    left: 0;
    z-index: ${(props) => props.zindex ?? "unset"};
`;

const SidebarAndMainContentContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100%;
`;

const MainBoxContainer = styled(Box)`
    padding: var(--gap-5) var(--gap-5) var(--gap-8) var(--gap-5);
    border-radius: var(--gap-1) 0 0 0;
    background: rgba(187, 187, 187, 0.3);
    overflow: auto;
    width: 100%;

    @media screen and (max-width: 900px) {
        padding: var(--gap-5) var(--gap-3) var(--gap-8) var(--gap-3);
    }
`;
