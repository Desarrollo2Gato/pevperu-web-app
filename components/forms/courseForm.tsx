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
import { imgUrl } from "@/utils/img/imgUrl";
import { ImgField } from "../ui/imgField";

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

  // img
  const [imgMain, setImgMain] = useState<any>(null);
  const [imgSecond, setImgSecond] = useState<any>(null);

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
      content: "",
      description: "",
      main_img: null,
      second_img: null,
      link: "",
      cost: "0.0",
      modality: "",
      email: "",
      phone: "",
      start_date: "",
      hours: "",
    },
  });

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (course) {
      if (course.photos && course.photos.length > 0) {
        setImgMain(imgUrl(course.photos[0].photo_url));
        if (course.photos.length > 1) {
          setImgSecond(imgUrl(course.photos[1].photo_url));
        }
      }
      reset({
        title: course.title || "",
        description: course.description || "",
        content: course.content || "",
        main_img: null,
        second_img: null,
        link: course.link || "",
        cost: course.cost || "0.0",
        modality: course.modality || "",
        email: course.email || "",
        phone: course.phone_number || "",
        start_date: course?.start_date
          ? new Date(course.start_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        hours: course.hours || "",
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
  const formatDateToISO = (date: any) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    const isUpdate = Boolean(course);
    const haveCompany = Boolean(user?.company_id);

    let autor_id: string | undefined;
    if (haveCompany) {
      autor_id = isUpdate
        ? course?.company.id.toString()
        : user?.company_id?.toString();

      if (autor_id) dataSend.append("company_id", autor_id);
    } else {
      autor_id = isUpdate
        ? course?.extern_user_id.toString()
        : user?.id?.toString();
      if (autor_id) dataSend.append("extern_user_id", autor_id);
    }

    dataSend.append("title", data.title);
    dataSend.append("description", data.description);
    dataSend.append("content", data.content);
    dataSend.append("start_date", formatDateToISO(data.start_date)),
    dataSend.append("link", data.link);
    dataSend.append("hours", data.hours);
    dataSend.append("modality", data.modality);
    dataSend.append("cost", data.cost);
    dataSend.append("phone_number", data.phone);
    dataSend.append("email", data.email);
    dataSend.append("published_at", new Date().toISOString());
    if (data.main_img) {
      dataSend.append("photos[]", data.main_img[0]);
    }

    if (data.second_img) {
      dataSend.append("photos[]", data.second_img[0]);
    }

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
          // console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al guardar los datos" });
        }
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
        <div className="flex flex-row flex-wrap gap-4 w-full justify-center">
          <ImgField
            id="main_img"
            imgLogo={imgMain || ""}
            setImgLogo={setImgMain}
            error={errors.main_img}
            register={register("main_img")}
            watch={watch("main_img")}
            isPost
          />
          <ImgField
            id="second_img"
            imgLogo={imgSecond || ""}
            setImgLogo={setImgSecond}
            error={errors.second_img}
            register={register("second_img")}
            watch={watch("second_img")}
            isPost
          />
        </div>

        <InputZodField
          id="title"
          name="Nombre"
          placeholder="Ingrese el nombre del curso"
          register={register("title")}
          error={errors.title}
        />
        <TextAreaZodField
          id="description"
          name="Descripción Corta"
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
        <InputZodField
          id="start_date"
          name="Fecha de inicio"
          type="date"
          register={register("start_date")}
          error={errors.start_date}
        />
        <InputZodField
          id="modality"
          name="Modalidad"
          placeholder="Presencial o Remoto"
          register={register("modality")}
          error={errors.modality}
        />
        <InputZodField
          id="hours"
          name="Horario"
          placeholder="Lunes, Miercoles y Viernes de 8:00 am - 10:00 am"
          register={register("hours")}
          error={errors.hours}
        />
        <InputZodField
          id="phone"
          name="Teléfono de contacto"
          placeholder="+51 999888333"
          register={register("phone")}
          error={errors.phone}
        />
        <InputZodField
          id="cost"
          name="Costo"
          placeholder="0.00"
          register={register("cost")}
          error={errors.cost}
        />
        <InputZodField
          id="email"
          name="Correo de contacto"
          placeholder="correo@gmail.com"
          register={register("email")}
          type="email"
          error={errors.email}
        />
        <InputZodField
          id="link"
          name="Enlace para mas información"
          placeholder="http://example.com"
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
