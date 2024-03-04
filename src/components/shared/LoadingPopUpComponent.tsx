import React from "react";
import Modal from "@mui/joy/Modal";
import Typography from "@mui/joy/Typography";
import Sheet from "@mui/joy/Sheet";
import { CircularProgress } from "@mui/joy";

type Props = {
    isLoading: boolean;
    message: string;
};

export const LoadingPopUpComponent: React.FC<Props> = (props: Props) => {
    const { isLoading, message } = props;

    return (
        <React.Fragment>
            <Modal
                open={isLoading}
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Sheet
                    variant="outlined"
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "max-content 1fr",
                        gridGap: "var(--gap-3)",
                        alignItems: "center",
                        alignContent: "center",
                        maxWidth: 600,
                        borderRadius: "md",
                        p: "var(--gap-2)",
                        boxShadow: "lg",
                    }}
                >
                    <CircularProgress
                        variant="solid"
                        color="primary"
                        size="sm"
                    />
                    <Typography
                        component="p"
                        level="title-lg"
                        textColor="inherit"
                        mb={1}
                        noWrap
                    >
                        {message}
                    </Typography>
                </Sheet>
            </Modal>
        </React.Fragment>
    );
};
