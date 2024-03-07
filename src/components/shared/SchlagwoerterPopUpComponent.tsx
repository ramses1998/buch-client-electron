import React from "react";
import { useRouter } from "next/router";
import { Button, ModalClose, Sheet } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogTitle from "@mui/joy/DialogTitle";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Divider from "@mui/joy/Divider";
import DialogContent from "@mui/joy/DialogContent";
import { CustomChipComponent } from "@/components/shared/CustomChipComponent";
import DialogActions from "@mui/joy/DialogActions";

type PropsModalSchlagwoerter = {
    schlagwoerter: string[];
    buchId: number;
    keywordsBeforeTextElipsis: number;
};
export const SchlagwoerterPopUpComponent: React.FC<PropsModalSchlagwoerter> = (
    props: PropsModalSchlagwoerter,
) => {
    const [open, setOpen] = React.useState<boolean>(false);
    const { schlagwoerter, buchId, keywordsBeforeTextElipsis } = props;
    const router = useRouter();

    return (
        <React.Fragment>
            <Button
                variant="plain"
                color="primary"
                onClick={() => setOpen(true)}
            >
                {`und ${schlagwoerter.length - keywordsBeforeTextElipsis} weitere`}
            </Button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <DialogTitle>
                        <VpnKeyOutlinedIcon />
                        Alle Schlagwörter
                    </DialogTitle>
                    <Divider />
                    <DialogContent>
                        <Sheet
                            variant="outlined"
                            sx={{
                                display: "flex",
                                gap: "var(--gap-1)",
                                flexWrap: "wrap",
                                p: 2,
                                borderRadius: "md",
                                maxWidth: "600px",
                            }}
                        >
                            {schlagwoerter.map((s, index) => (
                                <CustomChipComponent key={index} value={s} />
                            ))}
                        </Sheet>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="solid"
                            color="primary"
                            onClick={() =>
                                router.push(`/buecher/update/${buchId}`)
                            }
                        >
                            Schlagwörter hinzufügen
                        </Button>
                        <Button
                            variant="plain"
                            color="neutral"
                            onClick={() => setOpen(false)}
                        >
                            Schließen
                        </Button>
                    </DialogActions>
                </ModalDialog>
            </Modal>
        </React.Fragment>
    );
};
