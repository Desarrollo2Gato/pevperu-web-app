import { Modal, Box, Typography } from "@mui/material";
import ButtonForm from "./buttonForm";

type RecjectedModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  title: string;
};

const RejectedModal: React.FC<RecjectedModalProps> = ({
  openModal,
  setOpenModal,
  title,
}) => {
  return (
    <Modal
      open={openModal}
      onClose={setOpenModal}
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
        
      </Box>
    </Modal>
  );
};

export default RejectedModal;
