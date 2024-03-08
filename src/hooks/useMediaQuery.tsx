// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from "react";

/**
 * Konstante für die maximale Breite von mobilen Ansichten.
 */
const MAX_VIEWPORT_WIDTH_ON_MOBILE = 992;

/**
 * Typ zur Beschreibung der Bildschirmgrößeninformationen.
 */
type MediaQuerySize = {
    isSmall: boolean;
    isLarge: boolean;
};

/**
 * Hook zur Ermittlung der aktuellen Bildschirmgröße in React-Komponenten.
 *
 * @returns Ein Objekt mit Informationen über die Bildschirmgröße.
 */
export const useMediaQuery = (): MediaQuerySize => {
    const [isSmall, setIsSmall] = useState<boolean>(false);
    const [isLarge, setIsLarge] = useState<boolean>(false);

    useEffect(() => {
        (() => {
            if (window.innerWidth <= MAX_VIEWPORT_WIDTH_ON_MOBILE) {
                setIsSmall(true);
                setIsLarge(false);
                return;
            }
            setIsSmall(false);
            setIsLarge(true);
        })();

        window.addEventListener("resize", handleScreenSize);
        return () => {
            window.removeEventListener("resize", handleScreenSize);
        };
    }, []);

    const handleScreenSize = (uiEvent: UIEvent) => {
        const { currentTarget } = uiEvent;
        // @ts-ignore
        const { innerWidth } = currentTarget as EventTarget;

        if (innerWidth <= MAX_VIEWPORT_WIDTH_ON_MOBILE) {
            setIsSmall(true);
            setIsLarge(false);
            return;
        }
        setIsSmall(false);
        setIsLarge(true);
    };

    return {
        isSmall,
        isLarge,
    };
};
