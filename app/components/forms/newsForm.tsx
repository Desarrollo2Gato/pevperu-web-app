import { useForm } from "react-hook-form";
import { InputField, InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { ICategory, INews } from "@/app/types/api";
import EditorHtml from "../ui/editotrHtml";

type NewsFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const NewsForm: React.FC<NewsFormProps> = ({ type, id, token, closeModal }) => {
  const [data, setData] = useState<INews>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(newsSaveSchema),
    defaultValues: {
      title: "",
      status: "pending",
      description: "",
      content: "",
      published_at: "",
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
        title: data.title || "",
        description: data.description || "",
        content: data.content || "",
        status: data.status || "",
        link: data.link || "",
        published_at: data.published_at
          ? new Date().toISOString().split("T")[0]
          : "",
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.news.getOne(id), {
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
      // company_id: data.companyId,
      // plan_id: data.plan,
    };

    const promise = new Promise(async (resolve, reject) => {
      console.log(dataSend);
      try {
        if (type === "create") {
          console.log("create");
          await axios.post(apiUrls.news.create, dataSend, {
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
            await axios.put(apiUrls.news.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
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
          id="published_at"
          name="Fecha"
          type="date"
          placeholder="Ingrese la fecha del evento"
          register={register("published_at")}
          error={errors.published_at}
        />
        
         <InputZodField
          id="link"
          name="Url del evento"
          placeholder="https://www.example.com"
          register={register("link")}
          error={errors.link}
        />
        

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

export default NewsForm;