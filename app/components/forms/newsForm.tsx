import { useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { INews } from "@/app/types/api";
import EditorHtml from "../ui/editotrHtml";
import { useAuthContext } from "@/app/context/authContext";
import { imgUrl } from "@/app/utils/img/imgUrl";
import { ImgField } from "../ui/imgField";

type NewsFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const NewsForm: React.FC<NewsFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const { user } = useAuthContext();

  const [news, setNews] = useState<INews>();
  // img
  const [imgMain, setImgMain] = useState<any>(null);
  const [imgSecond, setImgSecond] = useState<any>(null);

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
    getValues,
  } = useForm({
    resolver: zodResolver(newsSaveSchema),
    defaultValues: {
      title: "",
      status: user?.type === "admin" ? "approved" : "pending",
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
    if (news) {
      if (news.photos && news.photos.length > 0) {
        setImgMain(imgUrl(news.photos[0].photo_url));
        if (news.photos.length > 1) {
          setImgSecond(imgUrl(news.photos[1].photo_url));
        }
      }
      reset({
        title: news.title || "",
        description: news.description || "",
        content: news.content || "",
        status: news.status || user?.type === "admin" ? "approved" : "pending",
        link: news.link || "",
        mainImage: null,
        secondImage: null,
        published_at: news.published_at
          ? new Date().toISOString().split("T")[0]
          : "",
      });
    }
  }, [news]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.news.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNews(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const date = new Date();
    const published_at = date.toISOString().split("T")[0];
    const dataSend = new FormData();
    if (!user?.company_id) {
      toast.error("No se ha podido obtener su id, recargue la página ");
      return;
    }
    if (news) {
      dataSend.append("company_id", news?.company_id.toString());
    } else {
      dataSend.append("company_id", user?.company_id.toString());
    }

    dataSend.append("title", data.title);
    dataSend.append("description", data.description);
    dataSend.append("content", data.content);
    dataSend.append("status", data.status);
    dataSend.append("status", data.status);
    dataSend.append("link", data.link);
    dataSend.append("published_at", published_at);

    if (data.mainImage) {
      dataSend.append("photos[]", data.mainImage[0]);
    }

    if (data.secondImage) {
      dataSend.append("photos[]", data.secondImage[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.news.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Noticia creada exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.news.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Noticia actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la noticia");
          }
        }
        getData();
        closeModal();
      } catch (error) {
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

        <div className="flex flex-row flex-wrap gap-4 w-full justify-center">
          <ImgField
            id="mainImage"
            imgLogo={imgMain || ""}
            setImgLogo={setImgMain}
            error={errors.mainImage}
            register={register("mainImage")}
            watch={watch("mainImage")}
            isPost
          />
          <ImgField
            id="secondImage"
            imgLogo={imgSecond || ""}
            setImgLogo={setImgSecond}
            error={errors.secondImage}
            register={register("secondImage")}
            watch={watch("secondImage")}
            isPost
          />
        </div>
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
          isdisabled={user?.type === "admin" ? false : true}
        />
        <InputZodField
          id="title"
          name="Titulo"
          placeholder="Ingrese el titulo de la noticia"
          register={register("title")}
          error={errors.title}
        />
        <TextAreaZodField
          id="description"
          name="Descripción"
          rows={2}
          placeholder="Ingrese una descripción corta de la noticia"
          register={register("description")}
          error={errors.description}
        />
        <EditorHtml
          text="Contenido"
          id="content"
          value={getValues("content")}
          setValue={setValue}
          error={errors.content}
        />

        <InputZodField
          id="published_at"
          name="Fecha"
          type="date"
          placeholder="Ingrese la fecha de la noticia"
          register={register("published_at")}
          error={errors.published_at}
        />

        <InputZodField
          id="link"
          name="Url de la noticia"
          placeholder="https://www.example.com"
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

export default NewsForm;
