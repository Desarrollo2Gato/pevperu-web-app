import { useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { courseSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { ICourse } from "@/types/api";
import { useAuthContext } from "@/context/authContext";
import EditorText from "../ui/editorText";

type CourseFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const CourseForm: React.FC<CourseFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const { user } = useAuthContext();

  const [course, setCourse] = useState<ICourse>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setValue,
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
    if (course) {
      reset({
        title: course.title || "",
        language: course.language || "",
        description: course.description || "",
        content: course.content || "",
        main_img: null,
        second_img: null,
        link: course.link || "",
      });
    }
  }, [course]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.courses.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourse(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    if (!user?.company_id) {
      toast.error("No se ha podido obtener su id, recargue la página ");
      return;
    }

    if (course) {
      dataSend.append("company_id", course?.company.id.toString());
    } else {
      dataSend.append("company_id", user?.company_id.toString());
    }

    dataSend.append("title", data.title);
    dataSend.append("language", data.language);
    dataSend.append("description", data.description);
    dataSend.append("content", data.content);
    dataSend.append("link", data.link);
    dataSend.append("published_at", new Date().toISOString());

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.courses.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Curso creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.courses.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Curso actualizado exitosamente" });
          } else {
            reject({ message: "No se ha podido obtener el id" });
          }
        }
        closeModal();
        getData();
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al guardar los datos" });
      } finally {
        setSubmitting(false);
      }
    });
    toast.promise(promise, {
      loading: "Guardando datos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  return (
    <>
      <form className="flex flex-col gap-2 mt-4">
        {type === "edit" && (
          <div className="w-full rounded-md bg-yellow-50 border border-zinc-100 p-2 mb-4">
            <p className="text-zinc-500 text-xs">
              Nota: Al subir nuevas imágenes, las anteriores serán eliminadas,{" "}
              <strong>
                le recomendamos subir las dos imágenes a la vez o descargarla
                antes de editar.
              </strong>
            </p>
          </div>
        )}

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
        <EditorText
          id="content"
          value={getValues("content")}
          setValue={setValue}
          onChange={(value: string) => setValue("content", value)}
          text="Contenido"
          error={errors.content}
        />
        {/* <EditorHtml
          text="Contenido"
          id="content"
          value={getValues("content")}
          setValue={setValue}
          error={errors.content}
        /> */}
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
            isdisabled={submitting}
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <ButtonForm
            text="Guardar"
            isdisabled={submitting}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default CourseForm;
