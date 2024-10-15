import { Modal, Box, Typography, duration } from "@mui/material";
import ButtonForm from "./buttonForm";
import { useForm } from "react-hook-form";
import { renewSubscriptionSchema } from "@/utils/shcemas/Admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputZodField } from "./inputField";
import { useState } from "react";
import axios from "axios";
import { apiUrls } from "@/utils/api/apiUrls";
import { toast } from "sonner";

type RenewModalProps = {
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  token: string;
  id?: number;
  getData: () => void;
};

const RenewModal: React.FC<RenewModalProps> = ({
  openModal,
  setOpenModal,
  token,
  id,
  getData,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(renewSubscriptionSchema),
    defaultValues: {
      duration: "",
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const onSubmit = async (data: any) => {
    if (!id) return;
    setSubmitting(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.post(
          apiUrls.subscription.renew(id.toString()),
          {
            duration: Number(data.duration),
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        getData();  
        resolve({ message: "Suscripción renovada" });
      } catch (error) {
        console.error(error);
        // if(axios.isAxiosError(error)){
        //   console.log(error.response?.data);
        // }
        reject({ message: "Error al renovar la suscripción" });
      } finally {
        setSubmitting(false);
        setOpenModal(false);
      }
    });
    toast.promise(promise, {
      loading: "Renovando suscripción...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

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
            max-h-screen overflow-y-auto"
      >
        <Typography
          id="custom-modal-title"
          variant="h6"
          className="text-2xl text-center font-bold text-zinc-500"
        >
          Renovar Suscripción
        </Typography>
        <form
          // onSubmit={handleSubmit((data) => {
          //   console.log(data);
          // })}
          className="mt-4"
        >
          <InputZodField
            id="duration"
            name="Duración (meses)"
            register={register("duration")}
            error={errors.duration}
          />
          <div className="flex justify-end gap-4 mt-4">
            <ButtonForm
              text="Cancelar"
              onClick={() => {
                setOpenModal(false);
              }}
              isdisabled={submitting}
            />
            <ButtonForm
              isdisabled={submitting}
              text="Renovar"
              type="submit"
              primary
              onClick={handleSubmit(onSubmit)}
            />
          </div>
        </form>
      </Box>
    </Modal>
  );
};

export default RenewModal;
