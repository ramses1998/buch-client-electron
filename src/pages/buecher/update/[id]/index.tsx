// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-floating-promises */
"use client";
import React, { useState } from "react";
import { Buch, BuchDto } from "@/api/buch";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import { BuchFormularComponent } from "@/components/shared/BuchFormularComponent";
import {
    convertBuchDtoToBuchUpdateModel,
    convertBuchToBuchDto,
    useApplicationContextApi,
} from "@/context/ApplicationContextApi";
import useSWR from "swr";
import { useRouter } from "next/router";
import { LoadingComponent } from "@/components/shared/LoadingComponent";
import Alert from "@mui/material/Alert";
import {
    Mitteilung,
    useMitteilungContext,
} from "@/context/NotificationContextApi";
import { v4 as uuid } from "uuid";
import { WrapperBuchFormularComponent } from "@/components/shared/WrapperBuchFormularComponent";
import { LoadingPopUpComponent } from "@/components/shared/LoadingPopUpComponent";

/**
 * React-Komponente für die Buchbearbeitungs-Seite.
 */
const BookUpdatePage: React.FC = () => {
    const mitteilungContext = useMitteilungContext();
    const appContext = useApplicationContextApi();
    const router = useRouter();

    /**
     * SWR-Hook zum Abrufen des Buches über den Applikationskontext.
     */
    const {
        data: buch,
        isLoading: isBuchLoading,
        error: buchError,
    } = useSWR<Buch>("getById", () =>
        appContext.getBuchById(parseInt(router.query?.id as string)),
    );

    /**
     * Zustand zum Markieren, ob das Bearbeiten gerade ausgeführt wird.
     */
    const [isUpdateLoading, setIsUpdateLoading] = useState<boolean>(false);

    /**
     * Zustand zum Speichern eines Fehlers beim Bearbeiten.
     */
    const [updateError, setUpdateError] = useState<Error | undefined>(
        undefined,
    );

    /**
     * Handler für das Submit-Event des Formulars.
     *
     * @param buchDto - Das DTO des zu bearbeitenden Buches.
     */
    const handleSubmit = async (buchDto: BuchDto) => {
        if (!buch) return;
        const buchUpdateModel = convertBuchDtoToBuchUpdateModel(buchDto);

        setIsUpdateLoading(true);
        setUpdateError(undefined);

        try {
            await appContext.updateBuch(
                buch.id,
                buch.version as number,
                buchUpdateModel,
            );
            mitteilungAusloesen();
            await router.push(`/buecher/${buch.id}`);
        } catch (err) {
            console.error(err);
            setUpdateError(err as Error);
        } finally {
            setIsUpdateLoading(false);
        }
    };

    /**
     * Funktion zum Auslösen einer Mitteilung nach erfolgreicher Aktualisierung.
     */
    const mitteilungAusloesen = () => {
        const neuMitteilung: Mitteilung = {
            id: uuid(),
            title: `Das Buch "${buch?.titel}" wurde erfolgreich geändert`,
            description: `Du hast das Buch ${buch?.titel} geändert`,
            seen: false,
            creationTimeStamp: new Date().toISOString(),
        };
        mitteilungContext.triggerMitteilung(neuMitteilung);
    };

    if (isBuchLoading || buch === undefined)
        return <LoadingComponent message="Das Buch wird geladen..." />;

    if (buchError) {
        return (
            <Alert severity="error">
                Ein Fehler ist aufgetreten: {(buchError as Error).toString()}
            </Alert>
        );
    }

    return (
        <PageWrapperComponent title="Buch ändern">
            <WrapperBuchFormularComponent>
                <div>
                    <BuchFormularComponent
                        buchDto={convertBuchToBuchDto(buch)}
                        onSubmit={handleSubmit}
                    />
                    {updateError ? (
                        <Alert sx={{ my: "var(--gap-2)" }} severity="error">
                            {`Ein Fehler ist aufgetreten: ${updateError.message}`}
                        </Alert>
                    ) : null}
                </div>
            </WrapperBuchFormularComponent>
            {isUpdateLoading ? (
                <LoadingPopUpComponent
                    isLoading={isUpdateLoading}
                    message={"Das Buch wird aktualisiert..."}
                />
            ) : null}
        </PageWrapperComponent>
    );
};

export default BookUpdatePage;
