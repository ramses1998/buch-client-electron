import React from "react";
import { InputField } from "@/context/ApplicationContextApi";
import FormLabel from "@mui/joy/FormLabel";
import { FormHelperText, Input, Stack, Typography } from "@mui/joy";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import FormControl from "@mui/joy/FormControl";

type Props = {
    input: InputField;
};
export const CustomStandardInputComponent: React.FC<Props> = (props) => {
    const { input } = props;

    return (
        <FormControl key={input.name} error={input.error}>
            <FormLabel
                sx={{
                    color: input.error ? "var(--color-error)" : "unset",
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
};
