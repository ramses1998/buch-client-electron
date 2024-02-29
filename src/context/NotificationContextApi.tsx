// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars, @typescript-eslint/ban-ts-comment */
import React, {
    createContext,
    PropsWithChildren,
    useContext,
    useState,
} from "react";

export type Mitteilung = {
    id: string;
    title: string;
    description: string;
    seen: boolean;
    creationTimeStamp: string;
};

type ContextOutput = {
    mitteilungen: Mitteilung[];
    triggerMitteilung: (mitteilung: Mitteilung) => void;
    setAllAsSeen: () => void;
    deleteMitteilung: (id: string) => void;
};

// @ts-expect-error
const MitteilungContext = createContext<ContextOutput>({});

export const useMitteilungContext = () => {
    return useContext(MitteilungContext);
};

type Props = PropsWithChildren;

export const MitteilungContextProvider: React.FC<Props> = (props: Props) => {
    const { children } = props;
    const [mitteilungen, setMitteilungen] = useState<Mitteilung[]>([]);

    const triggerMitteilung = (mitteilung: Mitteilung) => {
        setMitteilungen((prevState) => [...prevState, mitteilung]);
    };

    const deleteMitteilung = (id: string) => {
        setMitteilungen((prevState) => prevState.filter((m) => m.id !== id));
    };

    const setAllAsSeen = () => {
        setMitteilungen((prevState) =>
            prevState.map((m) => ({ ...m, seen: true })),
        );
    };

    return (
        <MitteilungContext.Provider
            value={{
                mitteilungen,
                triggerMitteilung,
                setAllAsSeen,
                deleteMitteilung,
            }}
        >
            {children}
        </MitteilungContext.Provider>
    );
};
