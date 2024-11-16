import { useForm } from "react-hook-form";
import { InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { CropSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { ICategory, ICrops } from "@/types/api";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";

type CropFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const CropForm: React.FC<CropFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [data, setData] = useState<ICrops>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [icon, setIcon] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(CropSchema),
    defaultValues: {
      name: "",
      icon: null,
    },
  });

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (data) {
      console.log("holi", type, id);
      if (data.icon_url) {
        setIcon(imgUrl(data.icon_url));
      }

      reset({
        name: data.name,
        icon: null,
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.crop.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(res.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    dataSend.append("name", data.name);
    // icon
    if (data.icon) {
      dataSend.append("icon", data.icon[0]);
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.crop.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Categoría creada exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.crop.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Categoría actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la categoría");
          }
        }
        closeModal();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log("error api", error);
          console.log("error api", error.response?.data);
        }
        reject({ message: "Error al guardar los datos" });
      } finally {
        setSubmitting(false);
        getData();
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
        <div className="flex justify-center ">
          <ImgField
            id="icon"
            imgLogo={icon}
            register={register("icon")}
            error={errors.icon}
            watch={watch("icon")}
            setImgLogo={setIcon}
            iscategory
          />
        </div>
        <InputZodField
          id="name"
          name="Nombre"
          placeholder="Nombre del cultivo"
          register={register("name")}
          error={errors.name}
        />
        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            isdisabled={submitting}
            text="Cancelar"
            onClick={() => {
              closeModal();
            }}
          />
          <ButtonForm
            text={loading ? "Guardando..." : "Guardar"}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default CropForm;
