import { Modal, Box, Typography } from "@mui/material";
import ButtonForm from "./buttonForm";

type FormModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  children?: React.ReactNode;
  title: string;
  onAction?: () => void;
  text?: string;
  textButton?: string;
};

export const FormModal: React.FC<FormModalProps> = ({
  openModal,
  setOpenModal,
  children,
  title,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        setOpenModal(false);
      }}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            bg-white border border-gray-300 shadow-lg rounded-lg
            p-4 sm:p-6 
            w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl
            max-h-[95vh] overflow-y-auto"
      >
        <Typography
          id="custom-modal-title"
          variant="h6"
          className="text-2xl text-center font-bold text-zinc-500"
        >
          {title}
        </Typography>
        {children}
      </Box>
    </Modal>
  );
};

export const ConfirmModal: React.FC<FormModalProps> = ({
  openModal,
  setOpenModal,
  title,
  onAction,
  text = "¿Está seguro que desea eliminar este registro?",
  textButton = "Eliminar",
}) => {
  const handleClose = () => {
    setOpenModal(false);
  };
  return (
    <Modal
      open={openModal}
      onClose={(event, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        handleClose();
      }}
      aria-labelledby="custom-modal-title"
      aria-describedby="custom-modal-description"
    >
      <Box
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
            bg-white border border-gray-300 shadow-lg rounded-lg
            p-4 sm:p-5 
            w-full max-w-xs sm:max-w-sm md:max-w-md 
            max-h-screen overflow-y-auto"
      >
        <Typography
          id="custom-modal-title"
          variant="h6"
          className="text-xl mb-2 text-center font-bold text-zinc-500"
        >
          {title}
        </Typography>
        <Typography
          id="custom-modal-description"
          variant="body1"
          className=" text-gray-500"
        >
          {text}
        </Typography>
        <div className="gap-8 flex justify-end items-center mt-5">
          <ButtonForm text="Cancelar" type="button" onClick={handleClose} />
          <ButtonForm text={textButton} onClick={onAction} primary />
        </div>
      </Box>
    </Modal>
  );
};
