import { useForm } from "react-hook-form";
import { InputField, InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { helpUpdateSchema, subscriptionSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { IHelpCompany } from "@/app/types/api";

type HelpCustomerProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const HelpCustomer: React.FC<HelpCustomerProps> = ({ type, id, token, closeModal }) => {
  const [data, setData] = useState<IHelpCompany>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(helpUpdateSchema),
    defaultValues: {

    },
  });
  

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (data) {
     
      reset({
       
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.help.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

 
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = {
     
    };

    const promise = new Promise(async (resolve, reject) => {
      console.log(dataSend);
      try {
        if (type === "create") {
          console.log("create");
          await axios.post(apiUrls.help.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log("creado");
          resolve({ message: "Suscripción creada exitosamente" });
        }
        if (type === "edit") {
          console.log("edit");
          if (id) {
            console.log("id", id);
            await axios.put(
              apiUrls.help.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            console.log("editado");
            resolve({ message: "Suscripción actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la suscripción");
          }
        }
      } catch (error) {
        console.error(error);
        if(axios.isAxiosError(error)){
          console.log(error.response?.data);
        }
        reject(error);
      } finally {
        setSubmitting(false);
      }
    });
    toast.promise(promise, {
      loading: "Guardando datos...",
      success: (data: any) => `${data.message}`,
      error: "Error al guardar los datos",
    });
  };

  return (
    <>
      <form className="flex flex-col gap-2 mt-4">
        {/* <SelectZodField
          id="companyId"
          name="Empresa"
          options={userData}
          placeholder="Seleccione una empresa"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("companyId")}
          error={errors.companyId}
        />
      
        <InputZodField
          id="startDate"
          name="Fecha de inicio"
          type="date"
          register={register("startDate")}
          error={errors.startDate}
        /> */}
        
        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            text="Cancelar"
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <ButtonForm text="Guardar" onClick={handleSubmit(onSubmit)} primary />
        </div>
      </form>
    </>
  );
};

export default HelpCustomer;
