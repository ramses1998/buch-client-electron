// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-unused-vars */
import React from "react";
import FormLabel from "@mui/joy/FormLabel";
import Select from "@mui/joy/Select";
import { BuchArt } from "@/api/buch";
import Option from "@mui/joy/Option";
import FormControl from "@mui/joy/FormControl";
import { InputField } from "@/context/ApplicationContextApi";
import Alert from "@mui/material/Alert";

type Props = {
    input: InputField;
    onChange: (propName: string, value: string) => void;
};

export const CustomDropdownComponent: React.FC<Props> = (props: Props) => {
    const { input, onChange } = props;

    const handleChange = (
        event: React.SyntheticEvent | null,
        value: string | null,
        propertyName: string,
    ) => {
        event?.preventDefault();
        onChange(propertyName, value as string);
    };

    if (!input.options) {
        return <Alert severity="error">Die Optionen sind nicht gesetzt!</Alert>;
    }

    return (
        <FormControl>
            <FormLabel>{input.placeholder}</FormLabel>
            <Select
                size="lg"
                value={input.value}
                startDecorator={input.startDecorator}
                onChange={(e, value) =>
                    handleChange(e, value as BuchArt, input.name as string)
                }
            >
                {input.options.map((option) => (
                    <Option key={option} value={option}>
                        {option}
                    </Option>
                ))}
            </Select>
        </FormControl>
    );
};
