import { useForm } from "react-hook-form";
import { TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { rejectedMessage } from "@/utils/shcemas/Admin";
import { useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import ButtonForm from "../ui/buttonForm";
import { IPlan } from "@/types/api";
import { toast } from "sonner";

type RejectedFormPros = {
  type: "event" | "product" | "news";
  id: number;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const RejectForm: React.FC<RejectedFormPros> = ({
  type,
  getData,
  id,
  token,
  closeModal,
}) => {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm({
    resolver: zodResolver(rejectedMessage),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = {
      observation: data.message,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        await axios.post(
          apiUrls.admin.disapprove(type, id.toString()),
          dataSend,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        resolve({ message: "Rechazado" });
      } catch (error) {
        console.error(error);
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "No se pudo rechazar" });
      } finally {
        closeModal();
        setSubmitting(false);
        getData();
      }
    });
    toast.promise(promise, {
      loading: "Rechazando...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  return (
    <>
      <form className="flex flex-col gap-2 mt-4">
        <TextAreaZodField
          id={`message`}
          name="Motivo"
          placeholder="Escriba el motivo de rechazo"
          register={register(`message`)}
          error={errors.message}
        />

        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            text="Cancelar"
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <ButtonForm
            text="Rechazar"
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default RejectForm;
