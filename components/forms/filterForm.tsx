import { useFieldArray, useForm } from "react-hook-form";
import {  InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import {  filterSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";
import { IFilter } from "@/types/api";

type FilterFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const FilterForm: React.FC<FilterFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [filter, setFilter] = useState<IFilter>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [icon, setIcon] = useState<any>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(filterSaveSchema),
    defaultValues: {
      name: "",
      options: [{ option_name: "" }],
      icon: null,
    },
  });
  const {
    fields: OptionsFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({
    control,
    name: "options",
  });

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (filter) {
      if (filter.icon) {
        setIcon(imgUrl(filter.icon));
      }

      reset({
        icon: null,
        name: filter.name,
        options: filter.options || [{ option_name: "" }],
      });
    }
  }, [filter]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.filter.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFilter(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const optionArray: string[] = data.options.map(
      (option: any) => option.option_name
    );
    const dataSend = new FormData();
    dataSend.append("name", data.name);
    optionArray.forEach((option: string) => {
      dataSend.append("options[]", option);
    });
   
    // icon
    if (data.icon) {
      dataSend.append("icon", data.icon[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.filter.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          resolve({ message: "Filtro creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(
              apiUrls.filter.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            resolve({ message: "Filtro actualizado exitosamente" });
          } else {
            reject("No se ha podido obtener el id del filtro");
          }
        }
        closeModal();
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
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
          placeholder="Nombre del filtro"
          register={register("name")}
          error={errors.name}
        />
        {/* Options */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Etiquetas</h2>
          {OptionsFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputZodField
                id={`options.${index}.option_name`}
                name="Opción"
                placeholder="Nombre de la opción"
                register={register(`options.${index}.option_name`)}
                error={errors.options?.[index]?.option_name}
              />
              <div className="flex items-center gap-2">
                {
                  // if is not the first element
                  OptionsFields.length > 1 && (
                    <ButtonArrayForm
                      text="Eliminar"
                      onClick={() => removeOption(index)}
                      isDelete
                    />
                  )
                }
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => appendOption({ option_name: "" })}
          />
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

export default FilterForm;
