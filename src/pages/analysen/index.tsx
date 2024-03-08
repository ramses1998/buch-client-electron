// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-misused-promises */
import React, { ReactNode } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { Box, Sheet, Card, Stack } from "@mui/joy";
import IconButton from "@mui/joy/IconButton";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import useSWR from "swr";
import { Buch } from "@/api/buch";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import AspectRatio from "@mui/joy/AspectRatio";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import { useRouter } from "next/router";
import { PreisChartComponent } from "@/components/shared/charts/PreisChartComponent";

/**
 * Typ für ein Key-Value-Paar, das in der Analyse-Übersicht angezeigt wird.
 */
type KeyValue = {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
};

/**
 * React-Komponente für die Analyse-Seite.
 */
export const AnalysisPage: React.FC = () => {
    const appContext = useApplicationContextApi();
    const router = useRouter();

    /**
     * SWR-Hook zum Abrufen aller Bücher.
     */
    const {
        data: buecher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", appContext.getAlleBuecher);

    /**
     * Funktion zur Berechnung der Anzahl aller Schlagwörter.
     *
     * @returns Die Anzahl aller Schlagwörter.
     */
    const getAnzahlSchlagwoerter = (): number => {
        if (!buecher) return 0;
        const alleSchlagwoerter = buecher
            .filter((b) => b.schlagwoerter?.length > 0)
            .map((b) => b.schlagwoerter)
            .flat();

        const alleSchlagwoerterOhneDuplikate = alleSchlagwoerter.reduce(
            (acc: string[], curr: string) =>
                acc.find((el) => el === curr) ? acc : [...acc, curr],
            [],
        );
        return alleSchlagwoerterOhneDuplikate.length;
    };

    /**
     * Funktion zur Berechnung der Anzahl lieferbarer Bücher.
     *
     * @returns Die Anzahl lieferbarer Bücher.
     */
    const getAnzahlLieferbareBuecher = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.lieferbar).length;
    };

    /**
     * Funktion zur Berechnung der Anzahl Bücher mit hohem Rabatt.
     *
     * @returns Die Anzahl Bücher mit hohem Rabatt.
     */
    const getAnzahlBuecherMitHohemRabatt = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.rabatt > 0.05).length;
    };

    /**
     * Funktion zur Berechnung der Anzahl Bücher mit guter Bewertung.
     *
     * @returns Die Anzahl Bücher mit guter Bewertung.
     */
    const getAnzahlBuecherMitGutemRating = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.rating >= 3).length;
    };

    /**
     * Funktion zur Berechnung der Anzahl Kindle-Bücher.
     *
     * @returns Die Anzahl Kindle-Bücher.
     */
    const getAnzahlKindelBuecher = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.art === "KINDLE").length;
    };

    const keyValues: KeyValue[] = [
        {
            icon: <VpnKeyOutlinedIcon />,
            title: `${getAnzahlSchlagwoerter()} Schlagwörter`,
            description: "Schlagwörter über alle Bücher hinweg.",
            onClick: () => router.push("/buecher"),
        },
        {
            icon: <LocalShippingOutlinedIcon />,
            title: `${getAnzahlLieferbareBuecher()} Lieferbar`,
            description: "Lieferbare Bücher über alle Bücher hinweg.",
            onClick: () => router.push("/buecher"),
        },
        {
            icon: <PercentOutlinedIcon />,
            title: `${getAnzahlBuecherMitHohemRabatt()} mit hohem Rabatt`,
            description: "Bücher mit einem Rabatt höher als 5%.",
            onClick: () => router.push("/buecher"),
        },
        {
            icon: <StarBorderPurple500OutlinedIcon />,
            title: `${getAnzahlBuecherMitGutemRating()} mit gutem Rating`,
            description: "Bücher mit 3 oder mehr Sternen als Bewertung.",
            onClick: () => router.push("/buecher"),
        },
        {
            icon: <AutoStoriesOutlinedIcon />,
            title: `${getAnzahlKindelBuecher()} KINDLE Bücher`,
            description: "Bücher, die runtergeladen werden können.",
            onClick: () => router.push("/buecher"),
        },
    ];

    if (isLoading || buecher === undefined)
        return <LoadingComponent message="Bücher werden geladen..." />;

    if (error) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(error as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent title="Analysen">
            <OverviewCardComponent buecher={buecher} />
            <Stack
                direction="row"
                justifyContent="space-between"
                justifyItems="space-between"
                sx={{ my: "var(--gap-5)" }}
            >
                <Typography level="h3">Kernzahlen</Typography>
                <Button variant="plain" onClick={() => router.push("/buecher")}>
                    Alle Bücher
                </Button>
            </Stack>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(5, 1fr)",
                    gap: "var(--gap-5)",
                    my: "var(--gap-5)",
                    "@media screen and (max-width: 1500px)": {
                        gridTemplateColumns: "repeat(3, 1fr)",
                    },
                    "@media screen and (max-width: 1000px)": {
                        gridTemplateColumns: "repeat(2, 1fr)",
                    },
                    "@media screen and (max-width: 600px)": {
                        gridTemplateColumns: "repeat(1, 1fr)",
                    },
                }}
            >
                {keyValues.map((key) => (
                    <KeyValueCardComponent key={key.title} {...key} />
                ))}
            </Box>
            <Typography level="h3">Preise</Typography>
            <Stack sx={{ my: "var(--gap-5)" }}>
                <PreisChartComponent buecher={buecher} />
            </Stack>
        </PageWrapperComponent>
    );
};

type PropsOverviewCard = {
    buecher: Buch[];
};
const OverviewCardComponent: React.FC<PropsOverviewCard> = (
    props: PropsOverviewCard,
) => {
    const { buecher } = props;
    const router = useRouter();

    return (
        <Sheet
            variant="solid"
            color="primary"
            invertedColors
            sx={{
                flexGrow: 1,
                display: "flex",
                bgcolor: "#042449",
                p: { xs: "36px", md: "70px" },
                pt: { xs: "24px", md: "60px" },
                borderRadius: "lg",
                overflow: "hidden",
                "& button": { borderRadius: "md" },
            }}
        >
            <Box sx={{ zIndex: 1, position: "relative" }}>
                <Typography level="h2">{`${buecher.length} Bücher insgesamt`}</Typography>
                <Typography sx={{ mt: 0.5, mb: 2 }}>
                    Die Analyseseite gibt Dir einen Überblick über alle Bücher.
                </Typography>
                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                        flexWrap: "wrap",
                        maxWidth: "max-content",
                        "& > *": { flexGrow: 1, fontWeight: "lg" },
                    }}
                >
                    <Button
                        sx={{ minWidth: 120 }}
                        onClick={() => router.push("/anlegen")}
                    >
                        Buch anlegen
                    </Button>
                    <Button
                        variant="plain"
                        endDecorator={<ArrowForwardIcon fontSize="small" />}
                        sx={{
                            "&:hover": { "--Button-gap": "0.625rem" },
                            "& span": { transition: "0.15s" },
                        }}
                        onClick={() => router.push("/buecher")}
                    >
                        Alle Bücher
                    </Button>
                </Box>
            </Box>
            <Box
                component="img"
                alt="banner-partial-background"
                src="/banner-partial-background.png"
                sx={{ position: "absolute", height: "100%", top: 0, right: 0 }}
            />
            <Typography
                sx={{
                    position: "absolute",
                    bottom: "1.5rem",
                    right: "2rem",
                    borderRadius: "50%",
                }}
            >
                {process.env.NEXT_PUBLIC_APPLICATION_NAME!}
            </Typography>
        </Sheet>
    );
};

type PropsKeyValueCard = KeyValue;
const KeyValueCardComponent: React.FC<PropsKeyValueCard> = (
    props: PropsKeyValueCard,
) => {
    const { icon, title, description, onClick } = props;
    return (
        <Card
            size="lg"
            variant="solid"
            color="neutral"
            invertedColors
            sx={{ maxWidth: 400, boxShadow: "lg", borderRadius: "xl" }}
        >
            <AspectRatio
                data-skip-inverted-colors
                variant="soft"
                color="primary"
                ratio="1"
                sx={{ width: 48 }}
            >
                <div>{icon}</div>
            </AspectRatio>

            <Typography level="h3">{title}</Typography>
            <Typography level="body-sm">{description}</Typography>

            <IconButton
                variant="plain"
                size="lg"
                sx={{
                    alignSelf: "flex-end",
                    justifySelf: "flex-end",
                    borderRadius: "50%",
                    mr: -1,
                    my: -1,
                }}
                onClick={onClick}
            >
                <ArrowForwardIcon />
            </IconButton>
        </Card>
    );
};

export default AnalysisPage;
