// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { BuchArt, BuchDto } from "@/api/buch";
import {
    Box,
    Button,
    Input,
    Stack,
    Typography,
    Sheet,
    Radio,
    FormHelperText,
} from "@mui/joy";
import { InputTypeMap } from "@mui/joy/Input/InputProps";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import TitleIcon from "@mui/icons-material/Title";
import TocIcon from "@mui/icons-material/Toc";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import DeleteForever from "@mui/icons-material/DeleteForever";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import { v4 as uuid } from "uuid";
import { regexValidator } from "@/context/ApplicationContextApi";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const INITIAL_BUCH_INPUT_MODEL: BuchDto = {
    isbn: "",
    rating: 0,
    art: "DRUCKAUSGABE",
    preis: 0,
    rabatt: 0,
    lieferbar: true,
    datum: "",
    homepage: "",
    schlagwoerter: [],
    titel: "",
    untertitel: "",
};

type InputDataType = "string" | "number" | "boolean";

type InputField = InputTypeMap["props"] & {
    isDropdown?: boolean | undefined;
    options?: string[];
    isDynamicList?: boolean | undefined;
};

type SchlagwortInput = {
    id: string;
    value: string;
    hint?: string | undefined;
};

type Props = {
    buchDto?: BuchDto | undefined;
    onSubmit: (buchDto: BuchDto) => void;
};

export const BuchFormularComponent: React.FC<Props> = (props: Props) => {
    const { buchDto, onSubmit } = props;

    const [bookToSubmit, setBookToSubmit] = useState<BuchDto>(
        buchDto ?? INITIAL_BUCH_INPUT_MODEL,
    );

    const [schlagwortInputList, setSchlagwortInputList] = useState<
        SchlagwortInput[]
    >([]);

    // useEffect(() => {
    //     if (!buchDto) return;
    //     setBookToSubmit(buchDto);
    // }, [buchDto]);

    const handleInputElementChange = (
        event: ChangeEvent<HTMLInputElement>,
        dataType: InputDataType,
    ) => {
        event?.preventDefault();

        const value = event.target.value;
        let result: string | number | boolean = "";

        switch (dataType) {
            case "string":
                result = value;
                break;
            case "number":
                result = Number(value);
                break;
            case "boolean":
                result = Boolean(value);
                break;
            default:
                result = value;
                break;
        }

        setBookToSubmit((prevState) => ({
            ...prevState,
            [event.target.name]: result,
        }));
    };

    const handleSelectElementChange = (
        event: React.SyntheticEvent | null,
        value: string | null,
        propertyName: string,
    ) => {
        event?.preventDefault();

        setBookToSubmit((prevState) => ({
            ...prevState,
            [propertyName]: value,
        }));
    };

    const handleLieferbarChange = () => {
        setBookToSubmit((prevState) => ({
            ...prevState,
            lieferbar: !prevState.lieferbar,
        }));
    };

    const deleteSchlagwort = (wort: string) => {
        setBookToSubmit((prevState) => ({
            ...prevState,
            schlagwoerter: prevState.schlagwoerter.filter((w) => w !== wort),
        }));
    };

    const addSchlagwortInput = () => {
        const schlagwort: SchlagwortInput = {
            id: uuid(),
            value: "",
        };
        setSchlagwortInputList((prevState) => [...prevState, schlagwort]);
    };

    const removeSchlagwortInput = (id: string) => {
        setSchlagwortInputList((prevState) =>
            prevState.filter((w) => w.id !== id),
        );
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

    const isSchlagwortValid = (schlagwortId: string): boolean => {
        const schlagwort = schlagwortInputList.find(
            (w) => w.id === schlagwortId,
        ) as SchlagwortInput;

        if (
            bookToSubmit.schlagwoerter
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

    const addSchlagwortToBuchDto = (schlagwortId: string) => {
        if (!isSchlagwortValid(schlagwortId)) return;

        const { value: wort } = schlagwortInputList.find(
            (s) => s.id === schlagwortId,
        ) as SchlagwortInput;

        setBookToSubmit((prevState) => ({
            ...prevState,
            schlagwoerter: [...prevState.schlagwoerter, wort],
        }));

        // Remove Input of word after it has been added to the BuchDto model
        setSchlagwortInputList((prevState) =>
            prevState.filter((s) => s.id !== schlagwortId),
        );
    };

    const formatDateForInputField = (dateString: string): string => {
        const currentDate = new Date(dateString);

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0");
        const day = String(currentDate.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    const isFormValid = (): boolean => {
        return inputFields
            .filter((f) => f.required)
            .map((f) => f.error)
            .every((v) => !v);
    };

    const inputFields: InputField[] = [
        {
            name: "isbn",
            value: bookToSubmit.isbn === "" ? undefined : bookToSubmit.isbn,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <NumbersOutlinedIcon fontSize="small" />,
            placeholder: "ISBN",
            required: true,
            error: !regexValidator.isbn.test(bookToSubmit.isbn),
        },
        {
            name: "titel",
            value: bookToSubmit.titel,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <TitleIcon fontSize="small" />,
            placeholder: "Titel",
            required: true,
            disabled: buchDto !== undefined,
            error: !regexValidator.titel.test(bookToSubmit.titel),
        },
        {
            name: "untertitel",
            value: bookToSubmit.untertitel,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <TocIcon fontSize="small" />,
            placeholder: "Untertitel",
            required: true,
            disabled: buchDto !== undefined,
            error: !regexValidator.untertitel.test(
                bookToSubmit.untertitel as string,
            ),
        },
        {
            name: "rating",
            value: bookToSubmit.rating === 0 ? undefined : bookToSubmit.rating,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <StarBorderOutlinedIcon fontSize="small" />,
            placeholder: "Bewertung",
            required: true,
            slotProps: {
                input: {
                    min: 0,
                    max: 5,
                },
            },
            error: !regexValidator.rating.test(
                bookToSubmit.rating as unknown as string,
            ),
        },
        {
            name: "art",
            value: bookToSubmit.art,
            startDecorator: <AutoStoriesOutlinedIcon fontSize="small" />,
            placeholder: "Art",
            required: true,
            isDropdown: true,
            options: ["DRUCKAUSGABE", "KINDLE"],
            error: false,
        },
        {
            name: "preis",
            value: bookToSubmit.preis === 0 ? undefined : bookToSubmit.preis,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <EuroOutlinedIcon fontSize="small" />,
            placeholder: "Preis",
            required: true,
            slotProps: {
                input: {
                    min: 0,
                    max: 10000,
                },
            },
            error: !regexValidator.preis.test(
                bookToSubmit.preis as unknown as string,
            ),
        },
        {
            name: "rabatt",
            value: bookToSubmit.rabatt === 0 ? undefined : bookToSubmit.rabatt,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <PercentOutlinedIcon fontSize="small" />,
            placeholder: "Rabatt",
            required: true,
            slotProps: {
                input: {
                    min: 0,
                    max: 1,
                },
            },
            error: !regexValidator.rabatt.test(
                bookToSubmit.rabatt as unknown as string,
            ),
        },
        {
            name: "lieferbar",
            value: bookToSubmit.lieferbar ? 1 : 0,
            type: "checkbox",
            onClick: handleLieferbarChange,
            startDecorator: <LocalShippingOutlinedIcon fontSize="small" />,
            placeholder: "Ist das Buch lieferbar ?",
            required: true,
            error: false,
        },
        {
            name: "datum",
            value:
                bookToSubmit.datum === ""
                    ? undefined
                    : formatDateForInputField(bookToSubmit.datum),
            type: "date",
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <CalendarMonthOutlinedIcon fontSize="small" />,
            placeholder: "Erscheinungsdatum",
            required: true,
            error: false,
        },
        {
            name: "schlagwoerter",
            // value: bookToSubmit.schlagwoerter,
            // onChange: () => {},
            startDecorator: <VpnKeyOutlinedIcon fontSize="small" />,
            placeholder: "Schlagwörter",
            required: true,
            isDynamicList: true,
            options: bookToSubmit.schlagwoerter,
            error: false,
        },
        {
            name: "homepage",
            value: bookToSubmit.homepage,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <LanguageOutlinedIcon fontSize="small" />,
            placeholder: "Homepage",
            required: true,
            error: !regexValidator.homepage.test(
                bookToSubmit.homepage as unknown as string,
            ),
        },
    ];

    return (
        <Stack spacing="var(--gap-2)">
            {inputFields.map((input) => {
                if (input.isDropdown && input.options) {
                    return (
                        <FormControl key={input.name}>
                            <FormLabel>{input.placeholder}</FormLabel>
                            <Select
                                size="lg"
                                value={input.value}
                                startDecorator={input.startDecorator}
                                onChange={(e, value) =>
                                    handleSelectElementChange(
                                        e,
                                        value as BuchArt,
                                        input.name as string,
                                    )
                                }
                            >
                                {input.options.map((option) => (
                                    <Option key={option} value={option}>
                                        {option}
                                    </Option>
                                ))}
                            </Select>
                            {/*<FormHelperText>This is a helper text.</FormHelperText>*/}
                        </FormControl>
                    );
                }
                if (input.type === "checkbox") {
                    return (
                        <Stack key={input.name} spacing={"var(--gap-1)"}>
                            <Typography level="title-sm">
                                {input.placeholder}
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={"var(--gap-2)"}
                                sx={{
                                    "& > div": {
                                        p: 2,
                                        borderRadius: "md",
                                        display: "flex",
                                    },
                                }}
                            >
                                <Sheet variant="outlined" key={1}>
                                    <Radio
                                        checked={input.value === 1}
                                        label="Lieferbar"
                                        overlay
                                        onClick={input.onClick}
                                    />
                                </Sheet>
                                <Sheet variant="outlined" key={2}>
                                    <Radio
                                        checked={input.value !== 1}
                                        label="Nicht lieferbar"
                                        overlay
                                        onClick={input.onClick}
                                    />
                                </Sheet>
                            </Stack>
                        </Stack>
                    );
                }
                if (input.isDynamicList && input.options) {
                    return (
                        <Stack key={input.name} spacing={"var(--gap-1)"}>
                            <Typography level="title-sm">
                                {input.placeholder}
                            </Typography>
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
                                        onClick={() => deleteSchlagwort(k)}
                                        endDecorator={
                                            <DeleteForever
                                                color="warning"
                                                fontSize="small"
                                            />
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
                                                handleSchlagwortInputChange(
                                                    e,
                                                    s.id,
                                                )
                                            }
                                        />
                                        <FormHelperText
                                            sx={{ color: "var(--color-error)" }}
                                        >
                                            {s.hint}
                                        </FormHelperText>
                                    </FormControl>
                                    <Button
                                        onClick={() =>
                                            addSchlagwortToBuchDto(s.id)
                                        }
                                    >
                                        Hinzufügen
                                    </Button>
                                    <Button
                                        color="danger"
                                        onClick={() =>
                                            removeSchlagwortInput(s.id)
                                        }
                                    >
                                        Abbrechen
                                    </Button>
                                </Stack>
                            ))}
                            <Box>
                                <Button onClick={addSchlagwortInput}>
                                    Neues Schlagwort
                                </Button>
                            </Box>
                        </Stack>
                    );
                }
                return (
                    <FormControl key={input.name} error={input.error}>
                        <FormLabel
                            sx={{
                                color: input.error
                                    ? "var(--color-error)"
                                    : "unset",
                            }}
                        >
                            {input.placeholder}
                        </FormLabel>
                        <Input
                            {...input}
                            placeholder=""
                            size="lg"
                            variant={input.disabled ? "solid" : "outlined"}
                            endDecorator={
                                input.disabled ? (
                                    <Stack
                                        direction="row"
                                        spacing="var(--gap-1)"
                                        alignItems="center"
                                        alignContent="center"
                                    >
                                        <Typography level="body-sm">
                                            Nicht änderbar
                                        </Typography>
                                        <DoNotDisturbAltIcon color="error" />
                                    </Stack>
                                ) : null
                            }
                        />
                        {input.error ? (
                            <FormHelperText>
                                <InfoOutlinedIcon fontSize="small" />
                                Dieser Wert ist ungültig
                            </FormHelperText>
                        ) : null}
                    </FormControl>
                );
            })}
            <Box>
                <Button
                    disabled={!isFormValid()}
                    onClick={() => onSubmit(bookToSubmit)}
                >
                    Speichern
                </Button>
            </Box>
        </Stack>
    );
};
