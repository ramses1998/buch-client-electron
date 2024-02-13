"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { ReactNode, useState } from "react";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import styled from "styled-components";
import { Box } from "@mui/joy";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemButton from "@mui/joy/ListItemButton";
import { useRouter } from "next/router";

const INITIAL_SIDEBAR_STATE = true;

type NavigationButton = {
    label: string;
    icon: ReactNode;
    isActive?: boolean;
    onClick: () => void;
};
export const SidebarComponent: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(INITIAL_SIDEBAR_STATE);
    const router = useRouter();

    const upperButtons: NavigationButton[] = [
        {
            label: "Startseite",
            icon: <DashboardOutlinedIcon />,
            isActive: router.pathname === "/",
            onClick: () => router.push("/"),
        },
        {
            label: "Bücher",
            icon: <StyleOutlinedIcon />,
            isActive: router.pathname === "/buecher",
            onClick: () => router.push("/buecher"),
        },
        {
            label: "Anlegen",
            icon: <AddOutlinedIcon />,
            isActive: router.pathname === "/anlegen",
            onClick: () => alert("In Bearbeitung"),
        },
        {
            label: "Analysen",
            icon: <BarChartOutlinedIcon />,
            isActive: router.pathname === "/analysen",
            onClick: () => alert("In Bearbeitung"),
        },
        {
            label: "Mitteilungen",
            icon: <NotificationsOutlinedIcon />,
            isActive: router.pathname === "/mitteilungen",
            onClick: () => alert("In Bearbeitung"),
        },
    ];

    const lowerButtons: NavigationButton[] = [
        {
            label: "Anmelden",
            icon: <LoginOutlinedIcon />,
            isActive: router.pathname === "/anmelden",
            onClick: () => alert("In Bearbeitung"),
        },
        {
            label: "Einstellungen",
            icon: <SettingsOutlinedIcon />,
            isActive: router.pathname === "/einstellungen",
            onClick: () => alert("In Bearbeitung"),
        },
        {
            label: "Seitenleite zuklappen",
            icon: isOpen ? (
                <KeyboardDoubleArrowLeftOutlinedIcon />
            ) : (
                <KeyboardDoubleArrowRightOutlinedIcon />
            ),
            onClick: () => setIsOpen((prevState) => !prevState),
        },
    ];

    return (
        <SidebarContainer>
            <ButtonListComponent
                key={1}
                buttons={upperButtons}
                showLabel={isOpen}
            />
            <ButtonListComponent
                key={2}
                buttons={lowerButtons}
                showLabel={isOpen}
            />
        </SidebarContainer>
    );
};
type PropsButtonList = {
    buttons: NavigationButton[];
    showLabel: boolean;
};
const ButtonListComponent: React.FC<PropsButtonList> = (
    props: PropsButtonList,
) => {
    const { buttons, showLabel } = props;

    return (
        <List>
            {buttons.map((button, index) => (
                <ListItem
                    key={`${button.label}${index}`}
                    onClick={button.onClick}
                >
                    <StyledListItemButton
                        selected={button.isActive}
                        color={button.isActive ? "primary" : "neutral"}
                    >
                        <ListItemDecorator>{button.icon}</ListItemDecorator>
                        {showLabel ? button.label : null}
                    </StyledListItemButton>
                </ListItem>
            ))}
        </List>
    );
};

const SidebarContainer = styled(Box)`
    display: grid;
    gap: var(--gap-1);
    grid-template-rows: 1fr max-content;
    height: 100%;
    padding: 0 var(--gap-1) var(--gap-1) var(--gap-1);
`;
const StyledListItemButton = styled(ListItemButton)`
    border-radius: var(--border-medium);
    padding: var(--gap-1) var(--gap-1);
`;
