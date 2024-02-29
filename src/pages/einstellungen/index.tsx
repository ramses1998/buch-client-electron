import React from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import {
    DetailsListComponent,
    Group,
} from "@/components/shared/DetailListComponent";
import MonitorIcon from "@mui/icons-material/Monitor";
import NewReleasesIcon from "@mui/icons-material/NewReleases";

type GroupName = "Über das System";
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
    ];
    return (
        <PageWrapperComponent title="Einstellungen">
            <DetailsListComponent groups={einstellungsGroup} />
        </PageWrapperComponent>
    );
};

export default EinstellungenPage;
