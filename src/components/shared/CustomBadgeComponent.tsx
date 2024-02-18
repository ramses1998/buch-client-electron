"use client";
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import React, { ReactNode } from "react";
import { Chip, Theme, useTheme } from "@mui/joy";
import styled from "styled-components";

type Props = {
  value: ReactNode;
};

export const CustomBadgeComponent: React.FC<Props> = (props) => {
  const { value } = props;
  const theme = useTheme();

  return (
    <StyledChip variant="outlined" color="primary" theme={theme}>
      {value}
    </StyledChip>
  );
};

const StyledChip = styled(Chip)<{ theme: Theme }>`
  padding: 5px var(--gap-1);
  border: 2px solid ${(props) => props.theme.palette.primary["500"]};
`;
