import {Buch} from "@/api/buch";
import React from "react";
import {Sheet} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

type PropsPreisChart = {
    buecher: Buch[];
};
export const PreisChartComponent: React.FC<PropsPreisChart> = (
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