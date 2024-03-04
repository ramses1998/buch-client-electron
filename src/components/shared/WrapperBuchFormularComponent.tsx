import React, { PropsWithChildren } from "react";
import { Box, Card, Divider, Sheet, Stack, Typography } from "@mui/joy";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {useMediaQuery} from "@/hooks/useMediaQuery";

type InformationItem = {
    title: string;
    description: string;
};

type Props = PropsWithChildren;

export const WrapperBuchFormularComponent: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const { isSmall } = useMediaQuery();

    const informationList: InformationItem[] = [
        {
            title: "ISBN",
            description: "Die ISBN muss Version 13 sein.",
        },
        {
            title: "Titel",
            description:
                "Der Titel muss kürzer als oder gleich 40 Zeichen sein.",
        },
        {
            title: "Untertitel",
            description:
                "Der Untertitel muss kürzer als oder gleich 40 Zeichen sein.",
        },
        {
            title: "Bewertung",
            description:
                "Das Feld Bewertung kann nur Werte zwischen 0 und 5 einschließlich annehmen.",
        },
        {
            title: "Preis",
            description:
                "Der Preis muss ein positiver Wert ohne Währungsangabe sein.",
        },
        {
            title: "Rabatt",
            description: "Rabatt darf nicht größer als 1 sein.",
        },
        {
            title: "Homepage",
            description: "Die Homepage des Buches muss eine gültige URL sein",
        },
    ];

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: isSmall ? "1fr" : "5fr 2fr",
                gridGap: "var(--gap-4)",
                alignItems: "start",
                alignContent: "start",
            }}
        >
            {children}
            <Card sx={{ mt: "var(--gap-2)" }}>
                <Stack direction="row" spacing="var(--gap-1)">
                    <WarningAmberIcon />
                    <Typography level="title-md">Information</Typography>
                </Stack>
                <Divider />
                <Sheet
                    variant="soft"
                    color="warning"
                    sx={{ borderRadius: "md", p: "var(--gap-1)" }}
                >
                    <Typography level="body-sm">
                        Beachte folgende Hinweise beim Ausfüllen des Formulars!
                    </Typography>
                </Sheet>

                <Stack spacing="var(--gap-2)">
                    {informationList.map((i) => (
                        <Stack key={i.title}>
                            <Typography level="title-sm">{i.title}</Typography>
                            <Typography level="body-sm">
                                {i.description}
                            </Typography>
                        </Stack>
                    ))}
                </Stack>
            </Card>
        </Box>
    );
};
