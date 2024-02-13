import React, { PropsWithChildren } from "react";
import { Box } from "@mui/joy";
import styled from "styled-components";
import { AppBarComponent } from "@/components/AppBarComponent";
import { SidebarComponent } from "@/components/SidebarComponent";

type Props = PropsWithChildren;

export const LayoutComponent: React.FC<Props> = (props: PropsWithChildren) => {
    const { children } = props;

    return (
        <ApplicationMainContainer>
            <StickyContainer>
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
    overflow-y: hidden;
`;

const StickyContainer = styled(Box)`
    position: sticky;
    top: 0;
    left: 0;
`;

const SidebarAndMainContentContainer = styled(Box)`
    display: grid;
    grid-template-columns: max-content 1fr;
    height: 100%;
`;

const MainBoxContainer = styled(Box)`
    padding: var(--gap-5) var(--gap-5) var(--gap-8) var(--gap-5);
    border-radius: var(--gap-2) 0 0 0;
    background: rgba(187, 187, 187, 0.3);
    overflow: auto;
    width: 100%;
`;
