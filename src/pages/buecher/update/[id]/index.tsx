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

const BookUpdatePage: React.FC = () => {
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
            <BuchFormularComponent
                buchDto={convertBuchToBuchDto(buch)}
                onSubmit={handleSubmit}
            />
        </PageWrapperComponent>
    );
};

export default BookUpdatePage;
