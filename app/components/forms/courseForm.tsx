import { useForm } from "react-hook-form";
import { InputField, InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  courseSaveSchema,
  helpUpdateSchema,
  subscriptionSaveSchema,
} from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { ICourse } from "@/app/types/api";
import EditorHtml from "../ui/editotrHtml";

type CourseFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const CourseForm: React.FC<CourseFormProps> = ({
  type,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<ICourse>();

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
    setValue
  } = useForm({
    resolver: zodResolver(courseSaveSchema),
    defaultValues: {
      title: "",
      language: "",
      description: "",
      content: "",
      main_img: null,
      second_img: null,
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
        language: data.language || "",
        description: data.description || "",
        content: data.content || "",
        main_img: null,
        second_img: null,
        link: data.link || "",
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.courses.getOne(id), {
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
          await axios.post(apiUrls.courses.create, dataSend, {
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
            await axios.put(apiUrls.courses.update(id?.toString()), dataSend, {
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
        <InputZodField
          id="title"
          name="Nombre"
          placeholder="Ingrese el nombre del curso"
          register={register("title")}
          error={errors.title}
        />
        <TextAreaZodField
          id="description"
          name="Descripción"
          placeholder="Ingrese una descripción corta"
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
          id="language"
          name="Idioma"
          placeholder="Ingrese el idioma del curso"
          register={register("language")}
          error={errors.language}
        />
        <InputZodField
          id="link"
          name="Correo de contacto"
          placeholder="Ingrese el correo de contacto"
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

export default CourseForm;
