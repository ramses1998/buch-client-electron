// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React, { ChangeEvent, useEffect, useState } from "react";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { BuchArt, BuchDto } from "@/http/buch";
import { Button, Input, Stack } from "@mui/joy";
import { InputTypeMap } from "@mui/joy/Input/InputProps";
import NumbersOutlinedIcon from "@mui/icons-material/NumbersOutlined";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import AutoStoriesOutlinedIcon from "@mui/icons-material/AutoStoriesOutlined";
import EuroOutlinedIcon from "@mui/icons-material/EuroOutlined";
import PercentOutlinedIcon from "@mui/icons-material/PercentOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

const INITIAL_BUCH_INPUT_MODELL: BuchDto = {
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
    isDropdown?: boolean;
    options?: string[];
};

type Props = {
    buchInputModel?: BuchDto;
    onSubmit: (buchDto: BuchDto) => void;
};

export const BuchFormularComponent: React.FC<Props> = (props: Props) => {
    const { buchInputModel, onSubmit } = props;
    const [bookToSubmit, setBookToSubmit] = useState<BuchDto>(
        INITIAL_BUCH_INPUT_MODELL,
    );

    useEffect(() => {
        console.log(bookToSubmit);
    }, [bookToSubmit]);

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

    const inputFields: InputField[] = [
        {
            name: "isbn",
            value: bookToSubmit.isbn,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <NumbersOutlinedIcon fontSize="small" />,
            placeholder: "ISBN",
            required: true,
        },
        {
            name: "titel",
            value: bookToSubmit.titel,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <LanguageOutlinedIcon fontSize="small" />,
            placeholder: "Titel",
            required: true,
        },
        {
            name: "untertitel",
            value: bookToSubmit.untertitel,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <LanguageOutlinedIcon fontSize="small" />,
            placeholder: "Untertitel",
            required: true,
        },
        {
            name: "rating",
            value: bookToSubmit.rating,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <StarBorderOutlinedIcon fontSize="small" />,
            placeholder: "Bewertung",
            required: true,
        },
        {
            name: "art",
            value: bookToSubmit.art,
            startDecorator: <AutoStoriesOutlinedIcon fontSize="small" />,
            placeholder: "Art",
            required: true,
            isDropdown: true,
            options: ["DRUCKAUSGABE", "KINDLE"],
        },
        {
            name: "preis",
            value: bookToSubmit.preis,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <EuroOutlinedIcon fontSize="small" />,
            placeholder: "Preis",
            required: true,
        },
        {
            name: "rabatt",
            value: bookToSubmit.rabatt,
            type: "number",
            onChange: (e) => handleInputElementChange(e, "number"),
            startDecorator: <PercentOutlinedIcon fontSize="small" />,
            placeholder: "Rabatt",
            required: true,
        },
        // {
        //     name: "lieferbar",
        //     //value: bookToSubmit.lieferbar,
        //     onChange: (e) => handleInputElementChange(e, "boolean"),
        //     startDecorator: <LocalShippingOutlinedIcon fontSize="small" />,
        //     placeholder: "Ist das Buch lieferbar",
        //     required: true,
        // },
        {
            name: "datum",
            value: bookToSubmit.datum,
            type: "date",
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <CalendarMonthOutlinedIcon fontSize="small" />,
            placeholder: "Erscheinungsdatum",
            required: true,
        },
        {
            name: "homepage",
            value: bookToSubmit.homepage,
            onChange: (e) => handleInputElementChange(e, "string"),
            startDecorator: <LanguageOutlinedIcon fontSize="small" />,
            placeholder: "Homepage",
            required: true,
        },
        // {
        //     name: "schlagwoerter",
        //     value: bookToSubmit.schlagwoerter,
        //     onChange: (e) => handleInputElementChange(e, "array"),
        //     startDecorator: <LanguageOutlinedIcon fontSize="small" />,
        //     placeholder: "Schlagwoerter",
        //     required: true,
        // },
    ];

    return (
        <Stack spacing="var(--gap-2)">
            {inputFields.map((input) => {
                if (input.isDropdown && input.options) {
                    return (
                        <FormControl key={input.name}>
                            <FormLabel>{input.placeholder}</FormLabel>
                            <Select
                                defaultValue={input.value}
                                size="lg"
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
                return (
                    <FormControl key={input.name}>
                        <FormLabel>{input.placeholder}</FormLabel>
                        <Input {...input} placeholder="" size="lg" />
                        {/*<FormHelperText>This is a helper text.</FormHelperText>*/}
                    </FormControl>
                );
            })}
            <Button onClick={() => onSubmit(bookToSubmit)}>Speichern</Button>
        </Stack>
    );
};
