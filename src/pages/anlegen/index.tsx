// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
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

const AnlegenPage: React.FC = () => {
    const appContext = useApplicationContextApi();
    const mitteilungContext = useMitteilungContext();

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
    const handleSubmit = async (buchDto: BuchDto) => {
        await appContext.createBuch(buchDto);
        mitteilungAusloesen(buchDto);
    };

    return (
        <PageWrapperComponent title="Buch anlegen">
            <WrapperBuchFormularComponent>
                <BuchFormularComponent onSubmit={handleSubmit} />
            </WrapperBuchFormularComponent>
        </PageWrapperComponent>
    );
};

export default AnlegenPage;
