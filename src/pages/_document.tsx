import { Head, Html, Main, NextScript } from "next/document";
import React from "react";

/**
 * Hauptkomponente für das gesamte HTML-Dokument der Next.js-Anwendung.
 */
const Document: React.FC = () => {
    return (
        <Html lang="de">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Document;
