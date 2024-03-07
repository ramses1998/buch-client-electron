// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useState } from "react";
import { InputField } from "@/context/ApplicationContextApi";
import {
    Box,
    Button,
    FormHelperText,
    Input,
    Sheet,
    Stack,
    Typography,
} from "@mui/joy";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import DeleteForever from "@mui/icons-material/DeleteForever";
import FormControl from "@mui/joy/FormControl";
import Alert from "@mui/material/Alert";
import { v4 as uuid } from "uuid";

type SchlagwortInput = {
    id: string;
    value: string;
    hint?: string | undefined;
};

type Props = {
    input: InputField;
    onCreate: (wort: string) => void;
    onDelete: (wort: string) => void;
};

export const WordSelectionInputComponent: React.FC<Props> = (props) => {
    const { input, onCreate, onDelete } = props;

    const [schlagwortInputList, setSchlagwortInputList] = useState<
        SchlagwortInput[]
    >([]);

    const createSchlagwortInput = () => {
        const schlagwort: SchlagwortInput = {
            id: uuid(),
            value: "",
        };
        setSchlagwortInputList((prevState) => [...prevState, schlagwort]);
    };

    const handleSchlagwortInputChange = (
        event: ChangeEvent<HTMLInputElement>,
        id: string,
    ) => {
        event?.preventDefault();
        setSchlagwortInputList((prevState) => {
            return prevState.map((w) => {
                if (w.id === id) {
                    return {
                        ...w,
                        value: event.target.value,
                    };
                }
                return w;
            });
        });
    };

    const addSchlagwortToEntity = (schlagwortId: string) => {
        if (!isSchlagwortValid(schlagwortId)) return;

        const { value: wort } = schlagwortInputList.find(
            (s) => s.id === schlagwortId,
        ) as SchlagwortInput;

        onCreate(wort);

        setSchlagwortInputList((prevState) =>
            prevState.filter((s) => s.id !== schlagwortId),
        );
    };

    const isSchlagwortValid = (schlagwortId: string): boolean => {
        if (!input.options) return false;

        const schlagwort = schlagwortInputList.find(
            (w) => w.id === schlagwortId,
        ) as SchlagwortInput;

        if (
            input.options
                .map((s) => s.toLowerCase())
                .includes(schlagwort.value.toLowerCase())
        ) {
            setSchlagwortInputList((prevState) =>
                prevState.map((s) => {
                    if (s.id !== schlagwortId) return s;
                    return {
                        ...s,
                        hint: "Dieses Schlagwort existiert bereits!",
                    };
                }),
            );
            return false;
        }

        if (schlagwort && schlagwort.value && schlagwort.value.length > 0)
            return true;

        setSchlagwortInputList((prevState) =>
            prevState.map((s) => {
                if (s.id !== schlagwortId) return s;
                return {
                    ...s,
                    hint: "Dieses Feld darf nicht leer sein!",
                };
            }),
        );
        return false;
    };

    const removeSchlagwortInput = (id: string) => {
        setSchlagwortInputList((prevState) =>
            prevState.filter((w) => w.id !== id),
        );
    };

    if (!input.options) {
        return <Alert severity="error">Die Optionen sind nicht gesetzt!</Alert>;
    }

    return (
        <Stack key={input.name} spacing={"var(--gap-1)"}>
            <Typography level="title-sm">{input.placeholder}</Typography>
            <Sheet
                variant="outlined"
                sx={{
                    display: "flex",
                    gap: "var(--gap-1)",
                    flexWrap: "wrap",
                    p: 2,
                    borderRadius: "md",
                }}
            >
                {input.options.map((k, index) => (
                    <CustomChipComponent
                        key={index}
                        value={k}
                        onClick={() => onDelete(k)}
                        endDecorator={
                            <DeleteForever color="warning" fontSize="small" />
                        }
                    />
                ))}
            </Sheet>
            {schlagwortInputList.map((s) => (
                <Stack
                    key={s.id}
                    direction="row"
                    spacing="var(--gap-1)"
                    sx={{
                        alignItems: "flex-start",
                        alignContent: "flex-start",
                    }}
                >
                    <FormControl>
                        <Input
                            placeholder="Schlagwort eingeben"
                            value={s.value}
                            onChange={(e) =>
                                handleSchlagwortInputChange(e, s.id)
                            }
                        />
                        <FormHelperText sx={{ color: "var(--color-error)" }}>
                            {s.hint}
                        </FormHelperText>
                    </FormControl>
                    <Button onClick={() => addSchlagwortToEntity(s.id)}>
                        Hinzufügen
                    </Button>
                    <Button
                        color="danger"
                        onClick={() => removeSchlagwortInput(s.id)}
                    >
                        Abbrechen
                    </Button>
                </Stack>
            ))}
            <Box>
                <Button onClick={createSchlagwortInput}>
                    Neues Schlagwort
                </Button>
            </Box>
        </Stack>
    );
};
