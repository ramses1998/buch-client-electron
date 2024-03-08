// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import { BuchFormularComponent } from "@/components/shared/BuchFormularComponent";
import { BuchDto } from "@/api/buch";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";
import {
    Mitteilung,
    useMitteilungContext,
} from "@/context/NotificationContextApi";
import { v4 as uuid } from "uuid";
import { WrapperBuchFormularComponent } from "@/components/shared/WrapperBuchFormularComponent";
import { useRouter } from "next/router";
import { LoadingPopUpComponent } from "@/components/shared/LoadingPopUpComponent";
import { Box } from "@mui/joy";
import Alert from "@mui/material/Alert";

/**
 * React-Komponente für die Anlegen-Seite.
 */
const AnlegenPage: React.FC = () => {
    const appContext = useApplicationContextApi();
    const mitteilungContext = useMitteilungContext();
    const router = useRouter();

    /**
     * Zustand zum Markieren, ob das Anlegen gerade ausgeführt wird.
     */
    const [isCreateLoading, setIsCreateLoading] = useState<boolean>(false);
    const [createError, setCreateError] = useState<Error | undefined>(
        undefined,
    );

    /**
     * Funktion zum Auslösen einer Mitteilung nach erfolgreichem Anlegen.
     *
     * @param buchDto - Das DTO des angelegten Buches.
     */
    const mitteilungAusloesen = (buchDto: BuchDto) => {
        const neuMitteilung: Mitteilung = {
            id: uuid(),
            title: `Neues Buch: Das Buch "${buchDto.titel}" wurde erfolgreich angelegt`,
            description: `Du hast das Buch ${buchDto.titel} angelegt`,
            seen: false,
            creationTimeStamp: new Date().toISOString(),
        };
        mitteilungContext.triggerMitteilung(neuMitteilung);
    };

    /**
     * Handler für das Submit-Event des Formulars.
     *
     * @param buchDto - Das DTO des zu erstellenden Buches.
     */
    const handleSubmit = async (buchDto: BuchDto) => {
        setIsCreateLoading(true);
        setCreateError(undefined);

        try {
            await appContext.createBuch(buchDto);
            mitteilungAusloesen(buchDto);
            await router.push("/buecher");
        } catch (error) {
            console.error(error);
            setCreateError(error as Error);
        } finally {
            setIsCreateLoading(false);
        }
    };

    return (
        <PageWrapperComponent title="Buch anlegen">
            <WrapperBuchFormularComponent>
                <Box>
                    <BuchFormularComponent onSubmit={handleSubmit} />
                    {createError ? (
                        <Alert sx={{ my: "var(--gap-2)" }} severity="error">
                            {`Ein Fehler ist aufgetreten: ${createError.message}`}
                        </Alert>
                    ) : null}
                </Box>
            </WrapperBuchFormularComponent>
            {isCreateLoading ? (
                <LoadingPopUpComponent
                    isLoading={isCreateLoading}
                    message={"Das Buch wird angelegt..."}
                />
            ) : null}
        </PageWrapperComponent>
    );
};

export default AnlegenPage;
