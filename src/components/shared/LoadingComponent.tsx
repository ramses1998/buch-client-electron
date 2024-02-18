import React from "react";
import { Box, CircularProgress, Typography } from "@mui/joy";
import styled from "styled-components";

type Props = {
  message?: string;
};

export const LoadingComponent: React.FC<Props> = (props) => {
  const { message } = props;

  return (
    <LoadingContainer>
      <CircularProgress variant="solid" color="primary" />
      {message ? <Typography>{message}</Typography> : null}
    </LoadingContainer>
  );
};

const LoadingContainer = styled(Box)`
  display: grid;
  grid-gap: var(--gap-1);
  justify-items: center;
  justify-content: center;
  align-items: center;
  align-content: center;
`;
