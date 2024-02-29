"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-floating-promises */
import React from "react";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import useSWR from "swr";
import { Buch } from "@/http/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import { Button, Stack } from "@mui/joy";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import { BookCardComponent } from "@/components/shared/BookCardComponent";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import ImportContactsOutlinedIcon from "@mui/icons-material/ImportContactsOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { RatingComponent } from "@/components/shared/RatingComponent";
import { CustomBadgeComponent } from "@/components/shared/CustomBadgeComponent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import {
    DetailsListComponent,
    Group,
} from "@/components/shared/DetailListComponent";
import { useRouter } from "next/router";
import {
    Mitteilung,
    useMitteilungContext,
} from "@/context/NotificationContextApi";
import { v4 as uuid } from "uuid";

type GroupName = "Über das Buch" | "Author" | "Lieferung" | "Sonstiges";

const BookDetailPage: React.FC = () => {
    const router = useRouter();

    const appContext = useApplicationContextApi();

    const {
        data: buch,
        isLoading,
        error,
    } = useSWR<Buch>("getById", () =>
        appContext.getBuchById(parseInt(router.query?.id as string)),
    );

    const mitteilungContext = useMitteilungContext();
    const { isSmall } = useMediaQuery();

    const mitteilungAusloesen = () => {
        const neuMitteilung: Mitteilung = {
            id: uuid(),
            title: `Das Buch "${buch?.titel}" wurde erfolgreich gelöscht`,
            description: `Du hast das Buch ${buch?.titel} gelöscht`,
            seen: false,
            creationTimeStamp: new Date().toISOString(),
        };
        mitteilungContext.triggerMitteilung(neuMitteilung);
    };

    const aboutBookGroup: Group<GroupName> = {
        name: "Über das Buch",
        items: [
            {
                icon: <NumbersOutlinedIcon fontSize="small" />,
                label: "ISBN",
                value: buch?.isbn,
            },
            {
                icon: <GradeOutlinedIcon fontSize="small" />,
                label: "Bewertung",
                value: <RatingComponent stars={buch?.rating as number} />,
            },
            {
                icon: <CalendarMonthOutlinedIcon fontSize="small" />,
                label: "Erscheinungsdatum",
                value: new Intl.DateTimeFormat("de-DE", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                }).format(buch?.datum),
            },
        ],
    };

    const authorGroup: Group<GroupName> = {
        name: "Author",
        items: [
            {
                icon: <LanguageOutlinedIcon fontSize="small" />,
                label: "Homepage",
                value: buch?.homepage,
            },
        ],
    };

    const deliveryGroup: Group<GroupName> = {
        name: "Lieferung",
        items: [
            {
                icon: <EuroOutlinedIcon fontSize="small" />,
                label: "Preis",
                value: `${buch?.preis} €`,
            },
            {
                icon: <PercentOutlinedIcon fontSize="small" />,
                label: "Rabatt",
                value: `${Number(buch?.rabatt.toFixed(2)) * 100} %`,
            },
            {
                icon: <ImportContactsOutlinedIcon fontSize="small" />,
                label: "Art",
                value: buch?.art,
            },
            {
                icon: <LocalShippingOutlinedIcon fontSize="small" />,
                label: "Lieferbar",
                value: buch?.lieferbar ? "Lieferbar" : "Nicht lieferbar",
            },
        ],
    };

    const othersGroup: Group<GroupName> = {
        name: "Sonstiges",
        items: [
            {
                icon: <VpnKeyOutlinedIcon fontSize="small" />,
                label: "Schlagwörter",
                value: (
                    <Stack direction="row" spacing={"var(--gap-1)"}>
                        {buch?.schlagwoerter?.map((w) => (
                            <CustomBadgeComponent key={w} value={w} />
                        ))}
                    </Stack>
                ),
            },
        ],
    };

    const allGroups = [aboutBookGroup, authorGroup, deliveryGroup, othersGroup];

    const handleDelete = async () => {
        if (!buch) return;
        await appContext.deleteBuch(buch.id, buch.version as number);
        mitteilungAusloesen();
        router.push("/buecher");
    };

    if (isLoading || buch === undefined)
        return <LoadingComponent message="Das Buch wird geladen..." />;

    if (error) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(error as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent title={"Buchdetails"}>
            <Stack
                direction={isSmall ? "column" : "row"}
                spacing={"var(--gap-5)"}
            >
                <Stack spacing={"var(--gap-4)"}>
                    <BookCardComponent buch={buch} />
                    <Stack spacing={"var(--gap-1)"} justifyItems={"center"}>
                        <Button
                            onClick={() =>
                                router.push(`/buecher/update/${buch.id}`)
                            }
                        >
                            Bearbeiten
                        </Button>
                        <Button color="danger" onClick={handleDelete}>
                            Löschen
                        </Button>
                    </Stack>
                </Stack>
                <Stack spacing={"var(--gap-3)"} sx={{ width: "100%" }}>
                    <DetailsListComponent groups={allGroups} />
                </Stack>
            </Stack>
        </PageWrapperComponent>
    );
};

export default BookDetailPage;
