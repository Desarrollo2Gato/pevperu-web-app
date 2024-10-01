import { useFieldArray, useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { IProduct } from "@/app/types/api";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { imgUrl } from "@/app/utils/img/imgUrl";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import EditorHtml from "../ui/editotrHtml";

import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useAuthContext } from "@/app/context/authContext";
import { ImgField } from "../ui/imgField";

type ProdcutFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

type TFile = {
  id: number;
  file_url: string;
  file_type: string;
};

const animatedComponents = makeAnimated();

const ProductForm: React.FC<ProdcutFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const { user } = useAuthContext();

  const [product, setProduct] = useState<IProduct>();
  const [categoriesData, setCategoriesData] = useState<any[]>([]);

  const [image, setImage] = useState<any | string>(null);
  const [image2, setImage2] = useState<any | null>(null);
  const [image3, setImage3] = useState<any | null>(null);
  const [image4, setImage4] = useState<any | null>(null);

  // files
  const [filesInitialData, setFilesInitialData] = useState<TFile[]>([]);
  // const [fileDownload, setFileDownload] = useState<string>("");

  const [filesData, setFilesData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingCategories, setGettingCategories] = useState(false);
  const [SelectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [labelsData, setLabelsData] = useState<any[]>([]);
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
      status: user?.type === "admin" ? "approved" : "pending",
      name: "",
      description: "",
      category_id: "",
      labels: [] as any[],
      specifications: [{ title: "", description: "" }],
      img1: null,
      img2: null,
      img3: null,
      img4: null,
      files: [{ file_type: "", file_url: null }],
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
    if (token) getCategories();
  }, [token]);

  useEffect(() => {
    if (product) {
      if (product?.photos && product?.photos.length > 0) {
        setImage(product.photos[0] && imgUrl(product?.photos[0].photo_url));
        setImage2(product.photos[1] && imgUrl(product?.photos[1].photo_url));
        setImage3(product.photos[2] && imgUrl(product?.photos[2].photo_url));
        setImage4(product.photos[3] && imgUrl(product?.photos[3].photo_url));
      }
      if (product.files && product.files.length > 0) {
        const FilesToDownload = product.files.map((file, index) => ({
          id: index,
          file_url: imgUrl(file.file_url) || "",
          file_type: file.file_label || "",
        }));
        setFilesInitialData(FilesToDownload);
      }
      reset({
        name: product.name || "",
        description: product.description || "",
        category_id: product.category.id.toString() || "",
        featured_product: product.featured_product.toString() || "false",
        specifications:
          product.specifications.length > 0
            ? product.specifications
            : [{ title: "", description: "" }],
        img1: null,
        img2: null,
        img3: null,
        img4: null,
        status:
          product.status || user?.type === "admin" ? "approved" : "pending",
      });
    }
  }, [product]);

  useEffect(() => {
    if (watch("category_id")) {
      getFiles(watch("category_id"));
      getLabels(watch("category_id"));
    }
  }, [categoriesData, watch("category_id")]);

  // get labels
  const getLabels = (categoryId: string) => {
    const category = categoriesData.find(
      (item) => item.id === Number(categoryId)
    );
    setSelectedLabels([]);
    console.log("labels :", category?.labels);
    return setSelectedLabels(category?.labels || []);
  };

  // obtener archivos segun la categoria
  const getFiles = (categoryId: string) => {
    // extraer files de categoryData
    const category = categoriesData.find(
      (item) => item.id === Number(categoryId)
    );
    setFilesData(category?.files || []);

    if (category?.files && category.files.length > 0) {
      const filesInput = category.files.map((file: any, index: number) => ({
        id: index,
        file_url: null,
        file_type: file.file_type,
      }));
      setValue("files", filesInput);
    }
  };

  const handleChange = (selected: any) => {
    // onli save id of labels
    const labels = selected.map((item: any) => item.value);
    setValue("labels", labels || []);
  };

  useEffect(() => {
    console.log("watch files", watch("files"));
    console.log("file 0", watch("files.0.file_url"));
  }, [watch("files")]);

  // const getLabels = (categoryId:string) => {
  //   const category = categoriesData.find(
  //     (item) => item.id = Number(categoryId)
  //   );

  // }

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
      toast.error("Error al obtener las categorías");
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

      setProduct(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los datos del producto");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data);
    setSubmitting(true);
    const dataSend = new FormData();
    if (!user?.company_id) {
      toast.error("No se ha podido obtener su id, recargue la página ");
      return;
    }
    if (product) {
      dataSend.append("company_id", product?.companies[0].id.toString());
    } else {
      dataSend.append("company_id", user?.company_id.toString());
    }
    dataSend.append("status", data.status);
    dataSend.append("name", data.name);
    dataSend.append("description", data.description);
    dataSend.append("category_id", data.category_id);
    dataSend.append(
      "featured_product",
      data.featured_product === "true" ? "1" : "0"
    );
    data.labels.forEach((label: number) => {
      dataSend.append("labels[]", label.toString());
    });
    data.specifications.map((spec: any, index: number) => {
      dataSend.append(`specifications[${index}][title]`, spec.title);
      dataSend.append(
        `specifications[${index}][description]`,
        spec.description
      );
    });

    if (data.img1) {
      dataSend.append("photos[]", data.img1[0]);
    }
    if (data.img2) {
      dataSend.append("photos[]", data.img2[0]);
    }
    if (data.img3) {
      dataSend.append("photos[]", data.img3[0]);
    }
    if (data.img4) {
      dataSend.append("photos[]", data.img4[0]);
    }

    // files
    data.files.forEach((file: any, index: number) => {
      if (file.file_url) {
        dataSend.append(`${file.file_type}`, file.file_url[0]);
      }
    });

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.product.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Producto creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(apiUrls.product.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            });
            resolve({ message: "Producto actualizado exitosamente" });
          } else {
            reject({ message: "No se pudo actualizar el producto" });
          }
        }
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al guardar los datos" });
      } finally {
        getData();
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
        <div className="flex flex-row flex-wrap gap-4 w-full justify-center">
          <ImgField
            id="img1"
            imgLogo={image || ""}
            setImgLogo={setImage}
            error={errors.img1}
            register={register("img1")}
            watch={watch("img1")}
            isPost
          />
          <ImgField
            id="img2"
            imgLogo={image2 || ""}
            setImgLogo={setImage2}
            error={errors.img2}
            register={register("img2")}
            watch={watch("img2")}
            isPost
          />
          <ImgField
            id="img3"
            imgLogo={image3 || ""}
            setImgLogo={setImage3}
            error={errors.img3}
            register={register("img3")}
            watch={watch("img3")}
            isPost
          />
          <ImgField
            id="img4"
            imgLogo={image4 || ""}
            setImgLogo={setImage4}
            error={errors.img4}
            register={register("img4")}
            watch={watch("img4")}
            isPost
          />
        </div>
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
          isdisabled={user?.type === "admin" ? false : true}
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
          onChange={(option) => {
            const value = option.target.value;
            getFiles(value);
            getLabels(value);
          }}
        />
        <InputZodField
          id="name"
          name="Producto"
          placeholder="Nombre del producto"
          register={register("name")}
          error={errors.name}
        />
        <EditorHtml
          text="Descripción"
          id="description"
          value={getValues("description")}
          setValue={setValue}
          error={errors.description}
        />
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
                {SpecificationsField.length > 1 && (
                  <ButtonArrayForm
                    text="Eliminar"
                    onClick={() => SpecificationsRemove(index)}
                    isDelete
                  />
                )}
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => SpecificationsAppend({ title: "", description: "" })}
          />
        </div>
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
          <label className="text-green-800 text-base font-medium">
            Archivos
          </label>

          {filesData.length > 0 ? (
            filesField.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
              >
                {/* <InputFileZod
                  id={`files.${index}.file_url`}
                  name={item.file_type}
                  placeholder="Seleccione un archivo"
                  register={register(`files.${index}.file_url`)}
                  setValue={setValue}
                  error={errors.files?.[index]?.file_url}
                /> */}
                <input
                  type="file"
                  id={`files.${index}.file_url`}
                  className={``}
                  // onChange={(e) => {
                  //   const file = e.target.files || null;
                  //   setValue(`files.${index}.file_url`, file);
                  // }}
                  accept="application/pdf"
                  {...register(`files.${index}.file_url`)}
                />
                {errors.files?.[index]?.file_url && (
                  <p className="text-red-500">
                    {errors.files[index].file_url.message}
                  </p>
                )}
              </div>
            ))
          ) : (
            <p className="text-zinc-700 text-xs text-center">
              No se requiere archivos
            </p>
          )}
        </div>

        <div>
          <label className="text-green-800 text-base font-medium">
            Etiquetas
          </label>
          <div className="mt-1">
            <Select
              isDisabled={SelectedLabels.length === 0}
              placeholder={
                SelectedLabels.length === 0
                  ? "No se requiere etiquetas"
                  : "Seleccione etiquetas"
              }
              components={animatedComponents}
              isMulti
              options={SelectedLabels.map((label) => ({
                value: label.id,
                label: label.name,
              }))}
              classNamePrefix="custom-select"
              onChange={handleChange}
              closeMenuOnSelect={false}
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "transparent",
                  borderColor: state.isFocused ? "#166534" : "#d4d4d8",
                  boxShadow: state.isFocused ? "none" : "none",
                  borderRadius: "6px",
                  paddingBlock: "4px",
                  paddingInline: "12px",
                  fontSize: "16px",
                  color: "#52525b",
                }),
                menu: (provided) => ({
                  ...provided,
                  zIndex: 9999,
                  fontSize: "14px",
                  color: "#52525b",
                }),
              }}
            />
          </div>
          {errors.labels && (
            <p className="mt-1 text-sm text-red-600">{errors.labels.message}</p>
          )}
        </div>

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
            type="submit"
            isdisabled={submitting}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default ProductForm;
