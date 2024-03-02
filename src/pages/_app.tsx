// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import "@/styles/globals.css";
import { LayoutComponent } from "@/components/LayoutComponent";
import React, { ComponentType } from "react";
import { ApplicationContextProvider } from "@/context/ApplicationContextApi";
import { MitteilungContextProvider } from "@/context/NotificationContextApi";

type Props = {
    Component: ComponentType;
    pageProps: any;
};

const App: React.FC<Props> = (props: Props) => {
    const { Component, pageProps } = props;

    return (
        <ApplicationContextProvider>
            <MitteilungContextProvider>
                <LayoutComponent>
                    <Component {...pageProps} />
                </LayoutComponent>
            </MitteilungContextProvider>
        </ApplicationContextProvider>
    );
};

export default App;
