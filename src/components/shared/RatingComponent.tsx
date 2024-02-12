import React from "react";
import { Box } from "@mui/joy";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import styled from "styled-components";

const MAX_RATING_VALUE = 5;

type PropsRating = {
    stars: number;
};

export const RatingComponent: React.FC<PropsRating> = (props: PropsRating) => {
    const { stars } = props;

    return (
        <RatingContainer>
            {Array.from(Array(MAX_RATING_VALUE).keys()).map((v, index) =>
                index < stars ? (
                    <StarIcon key={v} color="primary" fontSize={"small"} />
                ) : (
                    <StarBorderIcon key={v} fontSize={"small"} />
                ),
            )}
        </RatingContainer>
    );
};

const RatingContainer = styled(Box)`
    display: grid;
    grid-template-columns: repeat(${MAX_RATING_VALUE}, 1fr);
`;
