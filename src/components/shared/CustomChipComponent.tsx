"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { ReactNode } from "react";
import { Chip, ChipTypeMap, Theme, useTheme } from "@mui/joy";
import styled from "styled-components";

type Props = ChipTypeMap["props"] & {
    value: ReactNode;
};

export const CustomChipComponent: React.FC<Props> = (props) => {
    const { value, ...rest } = props;
    const theme = useTheme();

    return (
        <StyledChip {...rest} variant="outlined" color="primary" theme={theme}>
            {value}
        </StyledChip>
    );
};

const StyledChip = styled(Chip)<{ theme: Theme }>`
    padding: 5px var(--gap-1);
    border: 2px solid ${(props) => props.theme.palette.primary["500"]};
`;
