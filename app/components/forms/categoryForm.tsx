import { useFieldArray, useForm } from "react-hook-form";
import {
  InputColorZodField,
  InputField,
  InputZodField,
} from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { ICategory } from "@/app/types/api";
import ButtonArrayForm from "../ui/buttonArrayFrom";

type CategoryFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  type,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<ICategory>();

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
    resolver: zodResolver(categorySaveSchema),
    defaultValues: {
      name: "",
      icon_url: null,
      labelBgColor: "",
      textColor: "",
      labels: [{ name: "" }],
      type: "",
      filter_ids: [],
      files: [{ file_type: "" }],
    },
  });
  const {
    fields: labelsFields,
    append: appendLabel,
    remove: removeLabel,
  } = useFieldArray({
    control,
    name: "labels",
  });

  const {
    fields: filesFields,
    append: appendFile,
    remove: removeFile,
  } = useFieldArray({
    control,
    name: "files",
  });

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (data) {
      if (icon) {
        setIcon(data.icon);
      }
      reset({
        name: data.name,
        icon_url: null,
        labelBgColor: data.background_color,
        textColor: data.text_color,
        labels: data.labels || [{ name: "" }],
        type: data.type,
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.category.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data);
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
          await axios.post(apiUrls.category.create, dataSend, {
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
            await axios.put(apiUrls.category.update(id?.toString()), dataSend, {
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
          id="name"
          name="Nombre"
          placeholder="Nombre de la categoría"
          register={register("name")}
          error={errors.name}
        />
        <InputColorZodField
          id="labelBgColor"
          name="Color de fondo"
          placeholder="Color de fondo"
          type="color"
          register={register("labelBgColor")}
          error={errors.labelBgColor}
        />
        <InputColorZodField
          id="textColor"
          name="Color del texto"
          placeholder="Color del texto"
          type="color"
          register={register("textColor")}
          error={errors.textColor}
        />
        <SelectZodField
          id="type"
          name="Tipo"
          options={["Principal", "Otros"]}
          placeholder="Seleccione un tipo"
          getOptionValue={(option) => option}
          getOptionLabel={(option) => option}
          register={register("type")}
          error={errors.type}
        />
        {/* labels */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Etiquetas</h2>
          {labelsFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputZodField
                id={`labels[${index}].name`}
                name="Nombre"
                placeholder="Nombre de la etiqueta"
                register={register(`labels.${index}.name`)}
                error={errors.labels?.[index]?.name}
              />
              <div className="flex items-center gap-2">
                {
                  // if is not the first element
                  labelsFields.length > 1 && (
                    <ButtonArrayForm
                      text="Eliminar"
                      onClick={() => removeLabel(index)}
                      isDelete
                    />
                  )
                }
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => appendLabel({ name: "" })}
          />
        </div>
        {/* files */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Archivos</h2>
          {filesFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputZodField
                id={`files[${index}].file_type`}
                name="Nombre del archivo"
                placeholder="Nombre del archivo"
                register={register(`files.${index}.file_type`)}
                error={errors.files?.[index]?.file_type}
              />
              <div className="flex items-center gap-2">
                {
                  // if is not the first element
                  filesFields.length > 1 && (
                    <ButtonArrayForm
                      text="Eliminar"
                      onClick={() => removeFile(index)}
                      isDelete
                    />
                  )
                }
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => appendFile({ file_type: "" })}
          />
        </div>

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

export default CategoryForm;
