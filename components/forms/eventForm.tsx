import { useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { eventSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { IEvents } from "@/types/api";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";
import { useAuthContext } from "@/context/authContext";
import EditorText from "../ui/editorText";

type EventFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const EventForm: React.FC<EventFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const { user } = useAuthContext();
  const [event, setEvent] = useState<IEvents>();

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
    resolver: zodResolver(eventSaveSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "Nacional",
      status: user?.type === "admin" ? "approved" : "pending",
      content: "",
      dateStart: new Date().toISOString().split("T")[0],
      dateEnd: new Date().toISOString().split("T")[0],
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
    if (event) {
      if (event.photos && event.photos.length > 0) {
        setImgMain(imgUrl(event.photos[0].photo_url));
        if (event.photos.length > 1) {
          setImgSecond(imgUrl(event.photos[1].photo_url));
        }
      }
      console.log("status", event.status);
      reset({
        title: event.name || "",
        description: event.description || "",
        type: event.type || "National",
        status: event.status || "pending",
        content: event.content || "",
        dateStart: event.date
          ? new Date(event.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        dateEnd: event.end_date
          ? new Date(event.end_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        location: event.location || "",
        mainImage: null,
        secondImage: null,
        link: event.link || "",
      });
    }
  }, [event]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.event.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEvent(res.data);
    } catch (error) {
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    const isUpdate = Boolean(event);
    const haveCompany = Boolean(isUpdate ? event?.company_id : false);

    let autor_id: string | undefined;
    if (haveCompany) {
      autor_id = isUpdate ? event?.company_id.toString() : user?.id.toString();
      if (autor_id) dataSend.append("company_id", autor_id);
    } else {
      autor_id = isUpdate
        ? event?.extern_user_id.toString()
        : user?.id?.toString();
      if (autor_id) dataSend.append("extern_user_id", autor_id);
    }
    // if (haveCompany) {
    //   autor_id = isUpdate
    //     ? event?.company.id.toString()
    //     : user?.company_id?.toString();

    //   if (autor_id) dataSend.append("company_id", autor_id);
    // } else {
    //   autor_id = isUpdate
    //     ? event?.extern_user_id.toString()
    //     : user?.id?.toString();
    //   if (autor_id) dataSend.append("extern_user_id", autor_id);
    // }

    dataSend.append("name", data.title);
    dataSend.append("description", data.description);
    dataSend.append("content", data.content);
    dataSend.append("date", data.dateStart.toISOString().split("T")[0]);
    dataSend.append("end_date", data.dateEnd.toISOString().split("T")[0]);
    dataSend.append("status", data.status);
    dataSend.append("location", data.location);
    dataSend.append("type", data.type);
    dataSend.append("link", data.link);

    if (data.mainImage) {
      dataSend.append("photos[]", data.mainImage[0]);
    }

    if (data.secondImage) {
      dataSend.append("photos[]", data.secondImage[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.event.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Evento creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.event.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Evento actualizada exitosamente" });
          } else {
            reject({ message: "No se ha podido obtener el id del evento" });
          }
        }
        closeModal();
        getData();
      } catch (error) {
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
          id="date"
          name="Fecha de inicio"
          type="date"
          placeholder="Ingrese la fecha del evento"
          register={register("dateStart")}
          error={errors.dateStart}
        />
        <InputZodField
          id="date"
          name="Fecha de fin"
          type="date"
          placeholder="Ingrese la fecha del evento"
          register={register("dateEnd")}
          error={errors.dateEnd}
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
            isdisabled={submitting}
          />
          <ButtonForm
            isdisabled={submitting}
            text={loading ? "Guardando..." : "Guardar"}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default EventForm;
