import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

/**
 * Hauptkomponente für das gesamte HTML-Dokument der Next.js-Anwendung.
 */
const Document: React.FC = () => {
    return (
        <Html lang="de">
            <Head>
                {/* Google Schriftarten (wichtig für die MUI-Komponenten) */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                />
                <link
                    rel="stylesheet"
                    href="https://fonts.googleapis.com/icon?family=Material+Icons"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
