import { useFieldArray, useForm } from "react-hook-form";
import { InputColorZodField, InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { ICategory } from "@/types/api";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";
import SelectTag from "../ui/selectTag";

type CategoryFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [data, setData] = useState<ICategory>();
  const [filtersData, setFiltersData] = useState<any[]>([]);

  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [icon, setIcon] = useState<any>(null);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(categorySaveSchema),
    defaultValues: {
      name: "",
      icon_url: null,
      labels: [{ name: "", bgColor: "#000000", textColor: "#ffffff" }],
      type: "",
      filter_ids: [] as any[],
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
    getFilters();
  }, []);

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (data && filtersData.length>0) {
      if (data.icon) {
        setIcon(imgUrl(data.icon));
      }
      let files;
      if (data.files) {
        files = data.files.map((file: any) => ({ file_type: file.label }));
      }
      let filterIds: number[] = [];
      if (data.filters && data.filters.length > 0) {
        filterIds = data.filters.map((filter: any) => filter.id);
        const filters = data.filters.map((filter: any) => ({
          value: filter.id,
          label: filter.name,
        }));
        setFiltersData(filters);
      }
      let labels;
      if (data.labels && data.labels.length > 0) {
        labels = data.labels.map((label: any) => ({
          name: label.name,
          bgColor: label.background_color || "#000000",
          textColor: label.text_color || "#ffffff",
        }));
      }
      reset({
        name: data.name,
        icon_url: null,
        labels: labels || [
          { name: "", bgColor: "#000000", textColor: "#ffffff" },
        ],
        type: data.type,
        filter_ids: filterIds || [],
        files: files || [{ file_type: "" }],
      });
    }
  }, [data, filtersData]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.category.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const getFilters = async () => {
    try {
      const res = await axios.get(apiUrls.filter.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedFilters(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los filtros");
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    dataSend.append("name", data.name);
    dataSend.append("type", data.type);

    //filters
    if (data.filter_ids.length > 0) {
      const filterIds = data.filter_ids.map((id: any) => id.toString());
      filterIds.forEach((id: any) => dataSend.append("filter_ids[]", id));
    }
    // files
    if (data.files.length > 0 && data.files[0].file_type) {
      const filesArray = data.files.map((file: any) => file.file_type);
      filesArray.forEach((file: any) =>
        dataSend.append("category_files[]", file)
      );
    }

    // data.specifications.map((spec: any, index: number) => {
    //   dataSend.append(`specifications[${index}][title]`, spec.title);
    //   dataSend.append(
    //     `specifications[${index}][description]`,
    //     spec.description
    //   );
    // });
    // labels
    if (data.labels.length > 0) {
      data.labels.map((label: any, index: number) => {
        if (label.name && label.bgColor && label.textColor) {
          dataSend.append(`labels[${index}][name]`, label.name);
          dataSend.append(
            `labels[${index}][background_color]`,
            label.bgColor.toString()
          );
          dataSend.append(
            `labels[${index}][text_color]`,
            label.textColor.toString()
          );
        }
      });
      // const labelsArray = data.labels.map((label: any) => label.name);
      // labelsArray.forEach((label: any) => dataSend.append("labels[name]", label));
    }else{
      dataSend.append("labels", "");
    }
    // icon
    if (data.icon_url) {
      dataSend.append("icon", data.icon_url[0]);
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.category.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Categoría creada exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(
              apiUrls.category.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
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
            id="icon_url"
            imgLogo={icon}
            register={register("icon_url")}
            error={errors.icon_url}
            watch={watch("icon_url")}
            setImgLogo={setIcon}
            iscategory
          />
        </div>
        <InputZodField
          id="name"
          name="Nombre"
          placeholder="Nombre de la categoría"
          register={register("name")}
          error={errors.name}
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
        {/* filtros */}
        <SelectTag
          data={filtersData}
          setData={setFiltersData}
          selectedItems={selectedFilters}
          setValue={setValue}
          value="filter_ids"
          text="Filtros"
          placeholder="filtros"
          displayField="name"
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
              <InputColorZodField
                id={`labels[${index}].bgColor`}
                name="Color de fondo"
                placeholder="Color de fondo"
                type="color"
                register={register(`labels.${index}.bgColor`)}
                error={errors.labels?.[index]?.bgColor}
              />
              <InputColorZodField
                id={`labels[${index}].textColor`}
                name="Color del texto"
                placeholder="Color del texto"
                type="color"
                register={register(`labels.${index}.textColor`)}
                error={errors.labels?.[index]?.textColor}
              />
              <div className="flex items-center gap-2">
                {/* {labelsFields.length > 1 && ( */}
                <ButtonArrayForm
                  text="Eliminar"
                  onClick={() => removeLabel(index)}
                  isDelete
                />
                {/* )} */}
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() =>
              appendLabel({
                name: "",
                bgColor: "#000000",
                textColor: "#ffffff",
              })
            }
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

export default CategoryForm;
