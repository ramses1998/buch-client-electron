// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
"use client";
import React, { ChangeEvent, useState } from "react";
import { BuchDto } from "@/api/buch";
import { Box, Button, Stack } from "@mui/joy";
import { InputField, regexValidator } from "@/context/ApplicationContextApi";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import TitleIcon from "@mui/icons-material/Title";
import TocIcon from "@mui/icons-material/Toc";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import { CustomDropdownComponent } from "@/components/shared/input/CustomDropdownComponent";
import { CustomRadioButtonGroupComponent } from "@/components/shared/input/CustomRadioButtonGroupComponent";
import { WordSelectionInputComponent } from "@/components/shared/input/WordSelectionInputComponent";
import { CustomStandardInputComponent } from "@/components/shared/input/CustomStandardInputComponent";

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

type Props = {
    buchDto?: BuchDto | undefined;
    onSubmit: (buchDto: BuchDto) => void;
};

export const BuchFormularComponent: React.FC<Props> = (props: Props) => {
    const { buchDto, onSubmit } = props;

    const [bookToSubmit, setBookToSubmit] = useState<BuchDto>(
        buchDto ?? INITIAL_BUCH_INPUT_MODEL,
    );

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

    const handleArtChange = (propName: string, value: string) => {
        setBookToSubmit((prevState) => ({
            ...prevState,
            [propName]: value,
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

    const handleCreateSchlagwort = (wort: string) => {
        setBookToSubmit((prevState) => ({
            ...prevState,
            schlagwoerter: [...prevState.schlagwoerter, wort],
        }));
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
            error: !regexValidator.homepage.test(bookToSubmit.homepage),
        },
    ];

    return (
        <Stack spacing="var(--gap-2)">
            {inputFields.map((input) => {
                if (input.isDropdown && input.options) {
                    return (
                        <CustomDropdownComponent
                            key={input.name}
                            input={input}
                            onChange={handleArtChange}
                        />
                    );
                }
                if (input.type === "checkbox") {
                    return (
                        <CustomRadioButtonGroupComponent
                            key={input.name}
                            input={input}
                        />
                    );
                }
                if (input.isDynamicList && input.options) {
                    return (
                        <WordSelectionInputComponent
                            key={input.name}
                            input={input}
                            onCreate={handleCreateSchlagwort}
                            onDelete={deleteSchlagwort}
                        />
                    );
                }
                return (
                    <CustomStandardInputComponent
                        key={input.name}
                        input={input}
                    />
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
