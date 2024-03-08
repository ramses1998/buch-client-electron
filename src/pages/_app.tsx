// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@/styles/globals.css";
import { LayoutComponent } from "@/components/LayoutComponent";
import React, { ComponentType } from "react";
import { ApplicationContextProvider } from "@/context/ApplicationContextApi";
import { MitteilungContextProvider } from "@/context/NotificationContextApi";
import { AuthContextProvider } from "@/context/AuthContextApi";

type Props = {
    Component: ComponentType;
    pageProps: any;
};

/**
 * Hauptkomponente der Anwendung, die die grundlegende Struktur bereitstellt und die Context-Provider initialisiert.
 */
const App: React.FC<Props> = (props: Props) => {
    const { Component, pageProps } = props;

    return (
        <AuthContextProvider>
            <ApplicationContextProvider>
                <MitteilungContextProvider>
                    <LayoutComponent>
                        <Component {...pageProps} />
                    </LayoutComponent>
                </MitteilungContextProvider>
            </ApplicationContextProvider>
        </AuthContextProvider>
    );
};

export default App;
