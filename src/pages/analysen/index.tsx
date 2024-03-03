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
import {
    BarChart,
    Bar,
    Area,
    AreaChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Divider from "@mui/joy/Divider";

type KeyValue = {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
};
export const AnalysisPage: React.FC = () => {
    const appContext = useApplicationContextApi();
    const router = useRouter();

    const {
        data: buecher,
        isLoading,
        error,
    } = useSWR<Buch[]>("getAll", appContext.getAlleBuecher);

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

    const getAnzahlLieferbareBuecher = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.lieferbar).length;
    };

    const getAnzahlBuecherMitHohemRabatt = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.rabatt > 0.05).length;
    };

    const getAnzahlBuecherMitGutemRating = (): number => {
        if (!buecher) return 0;
        return buecher.filter((b) => b.rating >= 3).length;
    };

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
                alt=""
                src="https://storage.googleapis.com/cms-storage-bucket/72521e62275b24d3c37d.png"
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

type PropsPreisChart = {
    buecher: Buch[];
};
const PreisChartComponent: React.FC<PropsPreisChart> = (
    props: PropsPreisChart,
) => {
    const { buecher } = props;

    return (
        <Sheet
            sx={{
                width: "100%",
                borderRadius: "md",
                p: "var(--gap-5) var(--gap-3)",
                boxShadow: "0 0 6px grey",
            }}
        >
            <Typography level="title-lg" sx={{ mb: "var(--gap-2)" }}>
                Einheit in €
            </Typography>
            <ResponsiveContainer width={"100%"} height={250}>
                <AreaChart
                    width={730}
                    height={250}
                    data={buecher}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                    <defs>
                        <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="var(--color-main)"
                                stopOpacity={0.15}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--color-main)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="titel" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Area
                        type="monotone"
                        dataKey="preis"
                        stroke="var(--color-main)"
                        fillOpacity={1}
                        fill="url(#colorUv)"
                        dot={{ stroke: "var(--color-main)", strokeWidth: 3 }}
                        strokeWidth={2}
                    />
                    <Area
                        type="monotone"
                        dataKey="titel"
                        stroke="var(--color-warn)"
                        fillOpacity={1}
                        fill="var(--color-warn)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Sheet>
    );
};

export default AnalysisPage;
