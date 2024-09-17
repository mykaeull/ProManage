import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React, { createContext, useContext, useState } from "react";
import { ThemeContext } from "../../contexts/ThemeContext";

const ModalContext = createContext({
    handleClose: () => {},
});

export const useModal = () => useContext(ModalContext);

interface ModalProps {
    modalButton: (handleOpen: () => void) => React.ReactNode;
    children: React.ReactNode;
}

export const ModalBox = ({ modalButton, children }: ModalProps) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { theme } = useContext(ThemeContext);

    const style = {
        position: "absolute" as "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "30rem",
        bgcolor: theme === "light" ? "#f3f4f6" : "#1f2937",
        border: "none",
        boxShadow: 24,
        p: 4,
    };

    return (
        <ModalContext.Provider value={{ handleClose }}>
            <div>
                {modalButton(handleOpen)}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>{children}</Box>
                </Modal>
            </div>
        </ModalContext.Provider>
    );
};
