// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/ban-ts-comment */
import React, { useEffect } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import {
    Mitteilung,
    useMitteilungContext,
} from "@/context/NotificationContextApi";
import styled from "styled-components";
import { Box, Stack, Typography, IconButton } from "@mui/joy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Alert from "@mui/material/Alert";

const MitteilungenPage: React.FC = () => {
    const mitteilungContext = useMitteilungContext();

    useEffect(() => {
        mitteilungContext.setAllAsSeen();
    }, []);

    const sortMitteilungen = (): Mitteilung[] => {
        return mitteilungContext.mitteilungen.sort(
            (a, b) =>
                new Date(b.creationTimeStamp).getTime() -
                new Date(a.creationTimeStamp).getTime(),
        );
    };

    return (
        <PageWrapperComponent
            title="Mitteilungen"
            subtitle={
                "Hier findest Du Mitteilungen, wenn ein Erreignis eintritt. Ein Erreignis tritt ein, wenn eine Schreiboperation erfolgreich abgeschlossen wurde."
            }
        >
            {mitteilungContext.mitteilungen.length > 0 ? (
                <MitteilungListComponent
                    mitteilungen={sortMitteilungen()}
                    onDelete={mitteilungContext.deleteMitteilung}
                />
            ) : (
                <Alert severity="info">Keine Mitteilungen</Alert>
            )}
        </PageWrapperComponent>
    );
};

type PropsMitteilung = {
    mitteilungen: Mitteilung[];
    onDelete: (id: string) => void;
};
const MitteilungListComponent: React.FC<PropsMitteilung> = (
    props: PropsMitteilung,
) => {
    const { mitteilungen, onDelete } = props;

    const formattTimeStamp = (timeStamp: string): string => {
        return new Date(timeStamp).toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Berlin",
        });
    };

    return (
        <Stack direction="column" spacing={"var(--gap-2)"}>
            {mitteilungen.map((mitteilung) => (
                <ItemContainer key={mitteilung.id}>
                    <TitleAndDescription>
                        <Typography component="p" level={"title-lg"} noWrap>
                            {mitteilung.title}
                        </Typography>
                        <Typography component="p" level={"body-sm"}>
                            {mitteilung.description}
                        </Typography>
                    </TitleAndDescription>
                    <Box sx={{ display: "grid", alignSelf: "start" }}>
                        <Typography component="p" level={"body-md"}>
                            {formattTimeStamp(mitteilung.creationTimeStamp)}
                        </Typography>
                        <IconButton
                            sx={{ justifySelf: "end" }}
                            color="danger"
                            onClick={() => onDelete(mitteilung.id)}
                        >
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Box>
                </ItemContainer>
            ))}
        </Stack>
    );
};

const ItemContainer = styled(Box)`
    display: grid;
    grid-gap: var(--gap-2);
    grid-template-columns: 1fr max-content;
    align-content: center;
    align-items: center;
    background-color: white;
    border-radius: var(--border-small);
    box-shadow: 0 0 2px grey;
    padding: var(--gap-2);
    border: 2px solid transparent;
    &:hover {
        border: 2px solid var(--color-main);
        box-shadow: 0 0 10px grey;
    }
`;
const TitleAndDescription = styled(Box)`
    display: grid;
    grid-gap: 5px;
    align-content: center;
    align-items: center;
`;

export default MitteilungenPage;
