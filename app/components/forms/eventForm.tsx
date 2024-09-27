import { useForm } from "react-hook-form";
import { InputField, InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { IEvents } from "@/app/types/api";
import EditorHtml from "../ui/editotrHtml";

type EventFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const EventForm: React.FC<EventFormProps> = ({
  type,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<IEvents>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(eventSaveSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "",
      status: "",
      content: "",
      date: "",
      location: "",
      mainImage: null,
      secondImage: null,
      link: "",
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
        title: data.name || "",
        description: data.description || "",
        type: data.type || "",
        status: data.status || "pending",
        content: data.content || "",
        date: data.date || "",
        location: data.location || "",
        mainImage: null,
        secondImage: null,
        link: data.link || "",
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.event.getOne(id), {
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
    const dataSend = {};

    const promise = new Promise(async (resolve, reject) => {
      console.log(dataSend);
      try {
        if (type === "create") {
          console.log("create");
          await axios.post(apiUrls.event.create, dataSend, {
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
              apiUrls.subscription.update(id?.toString()),
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
        if (axios.isAxiosError(error)) {
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
        <SelectZodField
          id="status"
          name="Estado"
          options={[
            { id: "pending", name: "Pendiente" },
            { id: "approved", name: "Aprobado" },
            { id: "rejected", name: "Rechazado" },
          ]}
          placeholder="Seleccione un estado"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("status")}
          error={errors.status}
        />
        <SelectZodField
          id="type"
          name="Tipo"
          options={["Nacional", "Internacional"]}
          placeholder="Seleccione un tipo"
          getOptionValue={(option) => option}
          getOptionLabel={(option) => option}
          register={register("type")}
          error={errors.type}
        />
        <InputZodField
          id="title"
          name="Titulo"
          placeholder="Ingrese el titulo del evento"
          register={register("title")}
          error={errors.title}
        />
        <TextAreaZodField
          id="description"
          name="Descripción"
          rows={2}
          placeholder="Ingrese una descripción corta del evento"
          register={register("description")}
          error={errors.description}
        />
        <EditorHtml
          text="Contenido"
          id="content"
          value={getValues("content")}
          // register={register("content")}
          setValue={setValue}
          error={errors.content}
        />
        <InputZodField
          id="date"
          name="Fecha"
          placeholder="Ingrese la fecha del evento"
          register={register("date")}
          error={errors.date}
        />
        <InputZodField
          id="location"
          name="Ubicación"
          placeholder="Ingrese la ubicación del evento"
          register={register("location")}
          error={errors.location}
        />
        <InputZodField
          id="link"
          name="Url del evento"
          placeholder="https://www.example.com"
          register={register("link")}
          error={errors.link}
        />
        {/* content */}
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

export default EventForm;
