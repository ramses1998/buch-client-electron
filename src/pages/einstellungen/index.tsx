import React from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import {
    DetailsListComponent,
    Group,
} from "@/components/shared/DetailListComponent";
import MonitorIcon from "@mui/icons-material/Monitor";
import NewReleasesIcon from "@mui/icons-material/NewReleases";
import FormatColorFillOutlinedIcon from "@mui/icons-material/FormatColorFillOutlined";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";
import HttpOutlinedIcon from "@mui/icons-material/HttpOutlined";
import HttpsOutlinedIcon from "@mui/icons-material/HttpsOutlined";
import MoreHorizOutlinedIcon from "@mui/icons-material/MoreHorizOutlined";

type GroupName = "Über das System" | "Über die Software";
const EinstellungenPage: React.FC = () => {
    const einstellungsGroup: Group<GroupName>[] = [
        {
            name: "Über das System",
            items: [
                {
                    icon: <MonitorIcon fontSize="small" />,
                    label: "Betriebsystem",
                    value: "Windows 11 Pro",
                },
                {
                    icon: <NewReleasesIcon fontSize="small" />,
                    label: "Version",
                    value: "22H2",
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
