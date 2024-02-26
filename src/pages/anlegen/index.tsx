// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-misused-promises */
import React from "react";
import { PageWrapperComponent } from "@/components/shared/PageWrapperComponent";
import { BuchFormularComponent } from "@/components/shared/BuchFormularComponent";
import { BuchDto } from "@/http/buch";
import { useApplicationContextApi } from "@/context/ApplicationContextApi";

const AnlegenPage: React.FC = () => {
    const appContext = useApplicationContextApi();

    const handleSubmit = async (buchDto: BuchDto) => {
        await appContext.createBuch(buchDto);
    };

    return (
        <PageWrapperComponent title="Buch anlegen">
            <BuchFormularComponent onSubmit={handleSubmit} />
        </PageWrapperComponent>
    );
};

export default AnlegenPage;
