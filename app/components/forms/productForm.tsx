import { useFieldArray, useForm } from "react-hook-form";
import {
  InputField,
  InputFileZod,
  InputZodField,
  TextAreaZodField,
} from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSaveSchema,
  subscriptionSaveSchema,
} from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { ICompany, IPlan, IProduct, ISubscription } from "@/app/types/api";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { imgUrl } from "@/app/utils/img/imgUrl";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import EditorHtml from "../ui/editotrHtml";

type ProdcutFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

type TFile = {
  id: number;
  file_url: string;
  file_type: string;
};

const ProductForm: React.FC<ProdcutFormProps> = ({
  type,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<IProduct>();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  const [image, setImage] = useState<any | string>("");
  const [image2, setImage2] = useState<any | null>(null);
  const [image3, setImage3] = useState<any | null>(null);
  const [image4, setImage4] = useState<any | null>(null);
  const [selectedImg, setSelectedImg] = useState<string | null>(null);

  // files
  const [filesInitialData, setFilesInitialData] = useState<TFile[]>([]);
  // const [fileDownload, setFileDownload] = useState<string>("");

  const [filesData, setFilesData] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<TFile>({
    id: 0,
    file_type: "",
    file_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingCategories, setGettingCategories] = useState(false);

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
    resolver: zodResolver(productSaveSchema),
    defaultValues: {
      status: "pending",
      name: "",
      description: "",
      category_id: "",
      labels: [] as any[],
      specifications: [{ title: "", description: "" }],
      img1: "",
      img2: null,
      img3: null,
      img4: null,
      files: [{ file_type: "", file_url: "" }],
      featured_product: "false",
    },
  });

  const {
    fields: SpecificationsField,
    append: SpecificationsAppend,
    remove: SpecificationsRemove,
  } = useFieldArray({
    control,
    name: "specifications",
  });
  const {
    fields: filesField,
    append: filesAppend,
    remove: filesRemove,
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
    getCategories();
  }, []);

  useEffect(() => {
    if (data) {
      if (data?.photos && data?.photos.length > 0) {
        setImage(data.photos[0] && data?.photos[0].photo_url);
        setImage2(data.photos[1] && data?.photos[1].photo_url);
        setImage3(data.photos[2] && data?.photos[2].photo_url);
        setImage4(data.photos[3] && data?.photos[3].photo_url);
      }
      if (data.files && data.files.length > 0) {
        const FilesToDownload = data.files.map((file, index) => ({
          id: index,
          file_url: imgUrl(file.file_url) || "",
          file_type: file.file_label || "",
        }));
        setFilesInitialData(FilesToDownload);
      }
      reset({
        name: data.name || "",
        description: data.description || "",
        category_id: data.category.id.toString() || "",
        featured_product: data.featured_product.toString() || "",
        specifications:
          data.specifications.length > 0
            ? data.specifications
            : [{ title: "", description: "" }],
        files: [],
        img1: "",
        img2: null,
        img3: null,
        img4: null,
        status: data.status || "",
      });
    }
  }, [data]);

  useEffect(() => {
    if (watch("category_id")) {
      getFiles(watch("category_id"));
      // getLabels(watch("category_id"));
    }
  }, [categoriesData, watch("category_id")]);

  // get labels
  // const getLabels = (categoryId: string) => {
  //   const category = categoriesData.find(
  //     (item) => item.id === Number(categoryId)
  //   );
  //   setSelectedLabels([]);
  //   return setLabelsData(category?.labels || []);
  // };

  // const filteredItems =
  //   labelsData.length > 0
  //     ? labelsData.filter((item) =>
  //         item.name.toLowerCase().includes(query.toLowerCase())
  //       )
  //     : [];

  // obtener archivos segun la categoria
  const getFiles = async (categoryId: string) => {
    // extraer files de categoryData
    const category = categoriesData.find(
      (item) => item.id === Number(categoryId)
    );
    setFilesData(category?.files || []);

    if (category?.files && category.files.length > 0) {
      const filesInput = category.files.map((file: any, index: number) => ({
        id: index,
        file_url: null,
        file_type: file.file_label || file.file_type,
      }));
      setValue("files", filesInput);
      console.log("files", filesInput);
    }
  };

  const getCategories = async () => {
    setGettingCategories(true);
    try {
      const res = await axios.get(apiUrls.category.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategoriesData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener las categorías");
    } finally {
      setGettingCategories(false);
    }
  };

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.product.getOne(id), {
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
    const dataSend = {
      company_id: data.companyId,
      plan_id: data.plan,
      start_date: formatDateToISO(data.startDate),
      end_date: formatDateToISO(data.endDate),
      is_active: Boolean(data.status),
    };

    const promise = new Promise(async (resolve, reject) => {
      console.log(dataSend);
      try {
        if (type === "create") {
          console.log("create");
          await axios.post(apiUrls.subscription.create, dataSend, {
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
            await axios.put(
              apiUrls.subscription.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
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
  const formatDateToISO = (date: any) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };
  return (
    <>
      <form className="flex flex-col gap-2 mt-4">
        <SelectZodField
          id="status"
          name="Estado"
          options={[
            { id: "pending", name: "Pendiente" },
            { id: "approved", name: "Aprbado" },
            { id: "rejected", name: "Rechazado" },
          ]}
          placeholder="Seleccione un estado"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("status")}
          error={errors.status}
        />
        <SelectZodField
          id="featured_product"
          name="Producto destacado"
          options={[
            { id: "true", name: "Si" },
            { id: "false", name: "No" },
          ]}
          placeholder="Seleccione una opoción"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("featured_product")}
          error={errors.featured_product}
        />
        <SelectZodField
          id="category_id"
          name="Categoría"
          options={categoriesData}
          placeholder="Seleccione una categoría"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("category_id")}
          error={errors.category_id}
        />
        <InputZodField
          id="name"
          name="Producto"
          type="date"
          placeholder="Nombre del producto"
          register={register("name")}
          error={errors.name}
        />
        {/* description */}
        <EditorHtml
          text="Descripción"
          id="description"
          value={getValues("description")}
          // register={register("description")}
          setValue={setValue}
          error={errors.description}
        />
        {/* especification */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Especificaciones</h2>
          {SpecificationsField.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputZodField
                id={`specifications.${index}.title`}
                name="Título"
                type="text"
                placeholder="Título de la especificación"
                register={register(`specifications.${index}.title`)}
                error={errors.specifications?.[index]?.title}
              />
              <TextAreaZodField
                id={`specifications.${index}.description`}
                name="Descripción"
                placeholder="Descripción de la especificación"
                register={register(`specifications.${index}.description`)}
                error={errors.specifications?.[index]?.description}
              />
              <div className="flex items-center gap-2">
                {
                  // if is not the first element
                  SpecificationsField.length > 1 && (
                    <ButtonArrayForm
                      text="Eliminar"
                      onClick={() => SpecificationsRemove(index)}
                      isDelete
                    />
                  )
                }
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => SpecificationsAppend({ title: "", description: "" })}
          />
        </div>
        {/* archivos cargados */}
        {filesInitialData.length > 0 && (
          <div className="flex flex-col gap-2">
            <h2 className=" font-medium text-zinc-500">Archivos cargados</h2>
            <div className="grid grid-cols-1 gap-2">
              {filesInitialData.map((file, index) => (
                <div
                  key={index}
                  className="flex flex-row justify-between items-center gap-2 p-2 border border-zinc-300 rounded-md"
                >
                  <p className="text-zinc-500 text-xs font-medium">
                    {file.file_type}
                  </p>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500"
                  >
                    Ver
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* files */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Archivos</h2>
          {filesField.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputFileZod
                id={`files.${index}.file_url`}
                name={item.file_type}
                placeholder="Seleccione un archivo"
                register={register(`files.${index}.file_url`)}
                error={errors.files?.[index]?.file_url}
              />
            </div>
          ))}
        </div>

        <div className="gap-8 flex justify-end items-center mt-4">
          <ButtonForm
            text="Cancelar"
            onClick={() => {
              reset();
              closeModal();
            }}
          />
          <ButtonForm
            text="Guardar"
            type="submit"
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default ProductForm;
