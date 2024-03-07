"use client";
import { BookListViewType } from "@/components/shared/BookListComponent";
import React, { ComponentType } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import FormatListBulletedOutlinedIcon from "@mui/icons-material/FormatListBulletedOutlined";
import { Button, ButtonGroup, IconButton } from "@mui/joy";

type ViewOption = {
    view: BookListViewType;
    title: string;
    icon: ComponentType<any>;
};

type Props = {
    view: BookListViewType;
    // eslint-disable-next-line no-unused-vars
    setView: (view: BookListViewType) => void;
};

export const ViewSwitcherComponent: React.FC<Props> = (props: Props) => {
    const { view, setView } = props;
    const { isSmall } = useMediaQuery();

    const viewOptions: ViewOption[] = [
        {
            view: "CARD",
            title: "Kartenansicht",
            icon: GridViewOutlinedIcon,
        },
        {
            view: "TABLE",
            title: "Tabellenansicht",
            icon: ViewListOutlinedIcon,
        },
        {
            view: "LIST",
            title: "Listenansicht",
            icon: FormatListBulletedOutlinedIcon,
        },
    ];

    return (
        <ButtonGroup sx={{ justifySelf: "end" }}>
            {isSmall ? (
                <>
                    {viewOptions.map((option) => (
                        <IconButton key={option.view}>
                            <option.icon
                                sx={{ padding: "5px" }}
                                fontSize="large"
                                color={
                                    view === option.view ? "primary" : "neutral"
                                }
                                onClick={() => setView(option.view)}
                            />
                        </IconButton>
                    ))}
                </>
            ) : (
                <>
                    {viewOptions.map((option) => (
                        <Button
                            key={option.view}
                            color={view === option.view ? "primary" : "neutral"}
                            variant={view === option.view ? "solid" : undefined}
                            onClick={() => setView(option.view)}
                        >
                            {option.title}
                        </Button>
                    ))}
                </>
            )}
        </ButtonGroup>
    );
};
