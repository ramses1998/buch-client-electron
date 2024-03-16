import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

/**
 * Hauptkomponente für das gesamte HTML-Dokument der Next.js-Anwendung.
 */
const Document: React.FC = () => {
    return (
        <Html lang="de">
            <Head>
                {/* Google Schriftarten und Material Icons (wichtig für MUI-Komponenten) */}
                <link rel="stylesheet" href="/inter.css" />
                <link rel="stylesheet" href="/material-icons.css" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
