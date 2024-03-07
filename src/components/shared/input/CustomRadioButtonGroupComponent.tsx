import React from "react";
import { InputField } from "@/context/ApplicationContextApi";
import { Radio, Sheet, Stack, Typography } from "@mui/joy";

type Props = {
    input: InputField;
};

export const CustomRadioButtonGroupComponent: React.FC<Props> = (props) => {
    const { input } = props;

    return (
        <Stack key={input.name} spacing={"var(--gap-1)"}>
            <Typography level="title-sm">{input.placeholder}</Typography>
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
};
