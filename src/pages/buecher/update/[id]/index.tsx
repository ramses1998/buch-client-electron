// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-floating-promises */
"use client";
import React from "react";
import { Buch, BuchDto } from "@/http/buch";
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

const BookUpdatePage: React.FC = () => {
    const mitteilungContext = useMitteilungContext();
    const appContext = useApplicationContextApi();
    const router = useRouter();

    const {
        data: buch,
        isLoading,
        error,
    } = useSWR<Buch>("getById", () =>
        appContext.getBuchById(parseInt(router.query?.id as string)),
    );
    const handleSubmit = async (buchDto: BuchDto) => {
        if (!buch) return;
        const buchUpdateModel = convertBuchDtoToBuchUpdateModel(buchDto);
        await appContext.updateBuch(
            buch.id,
            buch.version as number,
            buchUpdateModel,
        );
        mitteilungAusloesen();
        await router.push("/buecher");
    };

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
        <PageWrapperComponent title="Buch ändern">
            <WrapperBuchFormularComponent>
                <BuchFormularComponent
                    buchDto={convertBuchToBuchDto(buch)}
                    onSubmit={handleSubmit}
                />
            </WrapperBuchFormularComponent>
        </PageWrapperComponent>
    );
};

export default BookUpdatePage;
