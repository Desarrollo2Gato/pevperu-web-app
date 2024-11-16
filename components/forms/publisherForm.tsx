import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { FaCheck } from "react-icons/fa";

import { publisherPermisses } from "@/utils/shcemas/Auth";
import { IUser, TProfession } from "@/types/api";

type PublisherFormProps = {
  type: "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const PublisherForm: React.FC<PublisherFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [publisher, setPublisher] = useState<IUser>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contentData, setContentData] = useState<TProfession[]>([]);
  const [gettingContent, setGettinContent] = useState<boolean>(false);

  useEffect(() => {
    getContent();
  }, []);
  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(publisherPermisses),
    defaultValues: {
      content: [] as string[],
    },
  });

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (publisher) {
      let typeselected: string[] = [];
      if (publisher.extern_types && publisher.extern_types.length > 0) {
        typeselected = publisher.extern_types.map((item) => item.id.toString());
      }
      reset({
        content: typeselected || [],
      });
    }
  }, [publisher]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.user.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPublisher(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };
  const getContent = async () => {
    setGettinContent(true);
    try {
      const res = await axios.get(apiUrls.extentTypes.getAll);
      console.log("tipo de contenido", res.data.data);
      setContentData(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error: ", error.response?.data);
      }
      toast.error("No los tipos de contenido");
    }
  };

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const currentContent = watch("content") || [];

    if (checked) {
      setValue("content", [...currentContent, value]);
    } else {
      setValue(
        "content",
        currentContent.filter((item: string) => item !== value)
      );
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (id) {
          await axios.patch(
            apiUrls.user.externType(id?.toString()),
            { extern_type_ids: data.content },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          resolve({ message: "Permisos actualizados" });
          closeModal();
        } else {
          reject("No se encontro el id del usuario");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al guardar los datos" });
        }
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
        <div className="w-full">
          <h3 className="text-green-800 text-base font-medium ">
            Tipo de contenido
          </h3>
          <div className="flex items-center justify-between mt-2">
            {contentData.length > 0 &&
              contentData.map((item, index) => (
                <label
                  key={index}
                  htmlFor={item.id.toString()}
                  className="text-stone-600 font-regular text-sm flex"
                >
                  <input
                    id={item.id.toString()}
                    className="hidden"
                    type="checkbox"
                    value={item.id.toString()}
                    checked={watch("content").includes(item.id.toString())}
                    onChange={handleOptionChange}
                  />
                  <span
                    className={`w-5 h-5 mr-2 rounded border-2 ${
                      watch("content").includes(item.id.toString())
                        ? "bg-green-800 border-green-800"
                        : "bg-white border-gray-300"
                    }  flex items-center justify-center text-center transform transition-all duration-700`}
                  >
                    {watch("content").includes(item.id.toString()) && (
                      <span className="text-white text font-semibold">✔</span>
                    )}
                  </span>
                  {item.name}
                </label>
              ))}
          </div>

          {errors.content && (
            <p style={{ color: "red" }}>{errors.content.message}</p>
          )}
        </div>
        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            isdisabled={submitting}
            text="Cancelar"
            onClick={() => {
              reset();
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

export default PublisherForm;
