// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment */
"use client";
import React, { useEffect, useState } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import {
    DetailsListComponent,
    Group,
} from "@/components/shared/DetailListComponent";
import MonitorIcon from "@mui/icons-material/Monitor";
import FormatColorFillOutlinedIcon from "@mui/icons-material/FormatColorFillOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import HttpOutlinedIcon from "@mui/icons-material/HttpOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

/**
 * Typ für den Gruppennamen in der Einstellungsseite.
 */
type GroupName = "Über das System" | "Über die Software";

/**
 * React-Komponente für die Einstellungsseite.
 */
const EinstellungenPage: React.FC = () => {
    const [betriebsystem, setBetriebsystem] = useState<string | undefined>(
        undefined,
    );

    /**
     * Auslesen des Betriebssystems des Benutzers.
     */
    useEffect(() => {
        const getOperatingSystem = (): string | undefined => {
            // Für Chromium-Browser
            // @ts-expect-error
            if (window.navigator.userAgentData) {
                // @ts-expect-error
                return window.navigator.userAgentData.platform;
            }

            // Für Firefox-Browser
            // @ts-expect-error
            if (window.navigator.oscpu) {
                // @ts-expect-error
                return window.navigator.oscpu;
            }
            return undefined;
        };

        setBetriebsystem(getOperatingSystem());
    }, []);

    const einstellungsGroup: Group<GroupName>[] = [
        {
            name: "Über das System",
            items: [
                {
                    icon: <MonitorIcon fontSize="small" />,
                    label: "Betriebsystem",
                    value: betriebsystem,
                },
            ],
        },
        {
            name: "Über die Software",
            items: [
                {
                    icon: <ConstructionOutlinedIcon fontSize="small" />,
                    label: "React-Framework",
                    value: "Next.js",
                },
                {
                    icon: <FormatColorFillOutlinedIcon fontSize="small" />,
                    label: "CSS-Framework",
                    value: "Material UI & Joy UI (alle von Google)",
                },
                {
                    icon: <HttpOutlinedIcon fontSize="small" />,
                    label: "HTTP-Client",
                    value: "Axios",
                },
                {
                    icon: <HttpsOutlinedIcon fontSize="small" />,
                    label: "Sicherheit und Benutzerverwaltung",
                    value: "KeyCloak",
                },
                {
                    icon: <MoreHorizOutlinedIcon fontSize="small" />,
                    label: "Sonstige Werkzeuge",
                    value: "Electron, Prettier, ESlint, SWR, Styled Components",
                },
            ],
        },
    ];

    return (
        <PageWrapperComponent title="Einstellungen">
            <DetailsListComponent groups={einstellungsGroup} />
        </PageWrapperComponent>
    );
};

export default EinstellungenPage;
