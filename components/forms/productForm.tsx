import { useFieldArray, useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { productSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { ICategory, ICompany, IProduct } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { imgUrl } from "@/utils/img/imgUrl";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import { useAuthContext } from "@/context/authContext";
import { ImgField } from "../ui/imgField";
import EditorText from "../ui/editorText";
import SelectTag from "../ui/selectTag";
import { ConfirmModal } from "../ui/modals";

type ProdcutFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

type TFile = {
  id: number;
  file_url: any;
  file_type: string;
  show: boolean;
};

type TFileData = {
  id: number;
  file: File;
  file_type: string;
  show: boolean;
};

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
  const [companiesData, setCompaniesData] = useState<ICompany[]>([]);

  const [image, setImage] = useState<any | string>(null);
  const [image2, setImage2] = useState<any | null>(null);
  const [image3, setImage3] = useState<any | null>(null);
  const [image4, setImage4] = useState<any | null>(null);

  // files
  const [filesInitialData, setFilesInitialData] = useState<TFile[]>([]);

  const [filesData, setFilesData] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingCategories, setGettingCategories] = useState(false);

  const [SelectedLabels, setSelectedLabels] = useState<any[]>([]);
  const [labelsData, setLabelsData] = useState<any[]>([]);

  const [files, setFiles] = useState<TFileData[]>([]);

  // filters
  const [filtersOptions, setFiltersOptions] = useState<any[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<ICategory>();

  //modal
  const [openModal, setOpenModal] = useState(false);
  const [selectFileId, setSelectFileId] = useState<number | null>(null);

  const [openModalShow, setOpenModalShow] = useState(false);
  const [selectFileStatus, setSelectFileStatus] = useState<boolean>(false);

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
      labels: [] as number[],
      specifications: [{ title: "", description: "" }],
      img1: null,
      img2: null,
      img3: null,
      img4: null,
      files: [{ file_type: "", file_label: "" }],
      featured_product: "false",
      company_id: user?.company_id || "",
      senasa_number: "",
      senasa_link: "",
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
  const { fields: filesField } = useFieldArray({
    control,
    name: "files",
  });
  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (token) {
      getCategories();
      getCompanies();
    }
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
          id: file.id,
          file_url: imgUrl(file.file_url) || "",
          file_type: file.file_label || "",
          show: file.show === 1 ? true : false,
        }));
        setFilesInitialData(FilesToDownload);
      }

      if (product.labels && product.labels.length > 0) {
        const labels = product.labels.map((label: any) => ({
          value: label.id,
          label: label.name,
        }));
        setLabelsData(labels);
      }

      if (product.labels && product.labels.length > 0) {
        const labels = product.labels.map((label: any) => Number(label.id));
        setValue("labels", labels || []);
      }
      if (product?.category.id) {
        getFiles();
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
        company_id: product.companies[0].id.toString() || user?.company_id,
        status:
          product.status || user?.type === "admin" ? "approved" : "pending",
        senasa_link: product.senasa_url || "",
        senasa_number: product.senasa_number || "",
      });
    }
  }, [product]);

  // useEffect(() => {
  //   const id = product?.category.id.toString();
  //   if (id) {
  //     handleCategoryChange(id);
  //     console.log("handlecategory");
  //   }
  // }, [product?.category.id]);

  useEffect(() => {
    const id = product?.category.id.toString();
    if (id) {
      handleCategoryChange(id);
    }
  }, [product?.category.id]);

  useEffect(() => {
    if (selectedCategory) {
      setFiltersOptions([]);
      setSelectedFilters([]);
      setSelectedLabels([]);

      getFiles();
      getLabels();
      getFilters();
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (product?.filter_options && product?.filter_options.length > 0) {
      if (filtersOptions.length > 0) {
        const filters = product?.filter_options.reduce(
          (acc: any, filter: any) => {
            const index = acc.findIndex(
              (item: any) => item.filter_id === filter.filter_id
            );
            if (index === -1) {
              acc.push({ filter_id: filter.filter_id, options: [filter] });
            } else {
              acc[index].options.push(filter);
            }
            return acc;
          },
          []
        );
        const filtersOptions = filters.map((filter: any) => {
          const options = filter.options.map((option: any) => ({
            value: option.id,
            label: option.option_name,
          }));
          return options;
        });
        setSelectedFilters(filtersOptions);
      }
    }
  }, [filtersOptions, product]);

  useEffect(() => {
    if (product?.labels && product?.labels.length > 0) {
      const labels = product.labels.map((label) => ({
        value: label.id,
        label: label.name,
      }));
      setLabelsData(labels);

      // Mapear los IDs
      const labelsIds = product.labels.map((label) => Number(label.id));
      setValue("labels", labelsIds || []);
    }
  }, [categoriesData, selectedCategory]);

  // get labels
  const getLabels = () => {
    setSelectedLabels([]);
    return setSelectedLabels(selectedCategory?.labels || []);
  };

  const getFiles = () => {
    setFilesData(selectedCategory?.files || []);
    if (selectedCategory?.files && selectedCategory?.files.length > 0) {
      const filesInput = selectedCategory?.files?.map(
        (file: any, index: number) => ({
          id: index,
          file_label: file.file_label || file.file_type || "",
          file_type: file.file_type || "",
        })
      );
      if (filesInput && filesInput.length > 0) {
        setValue("files", filesInput);
      }
    }
  };

  const getFilters = async () => {
    setFiltersOptions([]);
    setSelectedFilters([]);

    const filtersId = selectedCategory?.filters?.map(
      (filter: any) => filter.id
    );

    if (filtersId && filtersId?.length > 0) {
      filtersId.forEach(async (filter: any) => {
        try {
          const res = await axios.get(
            apiUrls.filter.getOne(filter.toString()),
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          setFiltersOptions((prevOptions) => [...prevOptions, res.data]);
        } catch (error) {
          toast.error("Error al obtener los filtros");
        }
      });
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
      toast.error("Error al obtener los datos del producto");
    } finally {
      setLoading(false);
    }
  };

  const getCompanies = async () => {
    try {
      const res = await axios.get(apiUrls.company.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCompaniesData(res.data);
    } catch (error) {
      toast.error("Error al obtener las empresas");
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);

    const filtersValue = selectedFilters
      .flat()
      .map((filter: any) => filter.value);

    const dataSend = new FormData();
    if (!user?.company_id) {
      toast.error("No se ha podido obtener su id, recargue la página ");
      return;
    }

    dataSend.append("company_id", data.company_id);

    dataSend.append("status", data.status);
    dataSend.append("name", data.name);
    dataSend.append("description", data.description);
    dataSend.append("category_id", data.category_id);
    dataSend.append("senasa_number", data.senasa_number);
    dataSend.append("senasa_url", data.senasa_link);
    dataSend.append(
      "featured_product",
      data.featured_product === "true" ? "1" : "0"
    );
    if (data.labels && data.labels.length > 0) {
      data.labels.forEach((label: number) => {
        dataSend.append("labels[]", label.toString());
      });
    }
    if (filtersValue.length > 0) {
      filtersValue.forEach((filter: number) => {
        dataSend.append("filter_options[]", filter.toString());
      });
    }

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
    if (files && files.length > 0) {
      files.forEach((file: any) => {
        if (file.file) {
          dataSend.append(`${file.file_type}`, file.file);
        }
      });
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          const res = await axios.post(apiUrls.product.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Producto creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            const res = await axios.post(
              apiUrls.product.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            resolve({ message: "Producto actualizado exitosamente" });
          } else {
            reject({ message: "No se pudo actualizar el producto" });
          }
        }
        closeModal();
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
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
    setSubmitting(false);
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categoriesData.find(
      (item) => item.id === Number(categoryId)
    );
    setSelectedCategory(category);
  };
  const handleFileChange =
    (index: number, file_type: string, show: boolean) => (e: any) => {
      setFiltersOptions([]);
      const file = e.target.files?.[0];
      if (files) {
        const newFileEntry = {
          id: index,
          file: file,
          file_type,
          show: show,
        };
        setFiles((prevFiles) => {
          const updatedFiles = [...prevFiles];
          updatedFiles[index] = newFileEntry;
          return updatedFiles;
        });
      }
    };

  const handleRemovefile = async (id: number) => {
    setOpenModal(true);
    setSelectFileId(id);
  };

  const removeFile = async () => {
    if (!selectFileId) return;
    try {
      await axios.delete(apiUrls.product_file.delete(selectFileId.toString()), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Archivo eliminado exitosamente");
      closeModal();
      setOpenModal(false);
    } catch (error) {
      toast.error("Error al eliminar el archivo");
    }
  };

  const toggleFile = async (id: number, status: boolean) => {
    setSelectFileId(id);
    setOpenModalShow(true);
    setSelectFileStatus(status);
  };

  const changeFileStatus = async () => {
    if (!selectFileId) return;
    try {
      await axios.put(
        apiUrls.product_file.showUpdate(
          selectFileId.toString(),
          selectFileStatus ? "0" : "1"
        ),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Estado del archivo actualizado");
      if (id) getDataById(id?.toString());
      setOpenModalShow(false);
    } catch (error) {
      // if (axios.isAxiosError(error)) {
      //   console.log(error.response?.data);
      // }
      toast.error("Error al actualizar el estado del archivo");
    }
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
          id="featured_product"
          name="Producto destacado"
          options={[
            { id: "true", name: "Si" },
            { id: "false", name: "No" },
          ]}
          placeholder="Seleccione una opción"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("featured_product")}
          error={errors.featured_product}
        />
        {user?.type === "admin" && (
          <SelectZodField
            id="company_id"
            name="Empresa"
            options={companiesData}
            placeholder="Seleccione una empresa"
            getOptionValue={(option) => option.id}
            getOptionLabel={(option) => option.name}
            register={register("company_id")}
            error={errors.company_id}
          />
        )}

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
            handleCategoryChange(value);
          }}
        />
        <SelectTag
          data={labelsData}
          setData={setLabelsData}
          selectedItems={SelectedLabels}
          // error={errors.labels}
          setValue={setValue}
          value="labels"
          text="Etiquetas"
          placeholder="etiquetas"
          displayField="name"
        />
        <>
          <h2 className=" font-medium text-green-800">Filtros</h2>
          <div className="flex flex-col gap-4 border border-zinc-300 rounded-md p-4">
            {filtersOptions.length > 0 ? (
              filtersOptions.map((filter, index) => (
                <SelectTag
                  key={index}
                  data={selectedFilters[index] || []}
                  setData={(newSelectedItems: any) => {
                    // Crear una copia del array actual
                    const updatedFilters = [...selectedFilters];

                    // Actualizar solo el índice correspondiente
                    updatedFilters[index] = newSelectedItems;

                    // Establecer el nuevo array en el estado
                    setSelectedFilters(updatedFilters);
                  }}
                  selectedItems={filter.options}
                  // error={errors.labels}
                  value="filters"
                  text={filter.name}
                  placeholder="opciones"
                  displayField="option_name"
                />
              ))
            ) : (
              <p className="text-zinc-500 text-sm">
                Esta categoría no requiere filtros
              </p>
            )}
          </div>
        </>

        <InputZodField
          id="name"
          name="Producto"
          placeholder="Nombre del producto"
          register={register("name")}
          error={errors.name}
        />
        {/* <EditorHtml
          text="Descripción"
          id="description"
          value={getValues("description")}
          setValue={setValue}
          error={errors.description}
        /> */}
        <EditorText
          id="description"
          value={getValues("description")}
          setValue={setValue}
          onChange={(value: string) => setValue("description", value)}
          text="Descripción"
          error={errors.description}
        />
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-green-800">Especificaciones</h2>
          <div className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4">
            <InputZodField
              id={`senasa_number`}
              name="N° Registro SENASA"
              placeholder="Senasa Numero"
              register={register(`senasa_number`)}
              error={errors.senasa_number}
            />
            <InputZodField
              id={`senasa_link`}
              name="Registro SENASA url"
              placeholder="https://pev.com.pe/"
              register={register(`senasa_link`)}
              error={errors.senasa_link}
            />
          </div>
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
                rows={2}
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
                  className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 py-2 px-4 border border-zinc-300 rounded-md"
                >
                  <p className="text-zinc-500 text-xs font-medium">
                    {file.file_type}
                  </p>
                  <div className="flex-row flex items-center justify-end gap-2 text-sm">
                    <button
                    type="button"
                      onClick={() => toggleFile(file.id, file.show)}
                      className={` px-2 py-1 ${
                        file.show
                          ? "bg-zinc-200 hover:bg-zinc-300 text-zinc-800"
                          : "bg-green-700 hover:bg-green-900 text-white"
                      }  rounded text-xs transition-all duration-500 flex justify-center items-center gap-1  `}
                    >
                      {file.show ? (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.1083 7.89453L7.8916 12.1112C7.34994 11.5695 7.0166 10.8279 7.0166 10.0029C7.0166 8.35286 8.34993 7.01953 9.99993 7.01953C10.8249 7.01953 11.5666 7.35286 12.1083 7.89453Z"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.8499 4.80937C13.3915 3.70937 11.7249 3.10938 9.99987 3.10938C7.0582 3.10938 4.31654 4.84271 2.4082 7.84271C1.6582 9.01771 1.6582 10.9927 2.4082 12.1677C3.06654 13.201 3.8332 14.0927 4.66654 14.8094"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.0166 16.276C7.9666 16.676 8.97493 16.8927 9.99993 16.8927C12.9416 16.8927 15.6833 15.1594 17.5916 12.1594C18.3416 10.9844 18.3416 9.00937 17.5916 7.83437C17.3166 7.40104 17.0166 6.99271 16.7083 6.60938"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.9252 10.582C12.7085 11.757 11.7502 12.7154 10.5752 12.932"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M7.89199 12.1094L1.66699 18.3344"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M18.3334 1.66797L12.1084 7.89297"
                              stroke="#52525B"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Ocultar
                        </>
                      ) : (
                        <>
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.9833 10.0029C12.9833 11.6529 11.6499 12.9862 9.99993 12.9862C8.34993 12.9862 7.0166 11.6529 7.0166 10.0029C7.0166 8.35286 8.34993 7.01953 9.99993 7.01953C11.6499 7.01953 12.9833 8.35286 12.9833 10.0029Z"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M9.99987 16.8893C12.9415 16.8893 15.6832 15.156 17.5915 12.156C18.3415 10.981 18.3415 9.00599 17.5915 7.83099C15.6832 4.83099 12.9415 3.09766 9.99987 3.09766C7.0582 3.09766 4.31654 4.83099 2.4082 7.83099C1.6582 9.00599 1.6582 10.981 2.4082 12.156C4.31654 15.156 7.0582 16.8893 9.99987 16.8893Z"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Mostrar
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="text-red-500 rounded text-xs transition-all duration-500 bg-red-200 hover:bg-red-500 hover:text-white px-2 py-1"
                      onClick={() => handleRemovefile(file.id)}
                    >
                      Eliminar
                    </button>
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 rounded text-xs transition-all duration-500 bg-blue-200 hover:bg-blue-500 hover:text-white px-2 py-1"
                    >
                      Ver
                    </a>
                  </div>
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
              // <InputFileZod
              //   key={item.id}
              //   id={`files${index}`}
              //   name={item.file_type}
              //   onChange={handleFileChange(index, item.file_type)}
              // />
              <div key={index}>
                <div className="w-full relative flex flex-col gap-1">
                  <label
                    htmlFor={`files${index}`}
                    className="text-zinc-500 font-medium text-base "
                  >
                    {item.file_label ? item.file_label : item.file_type}
                  </label>
                  <input
                    type="file"
                    id={`files${index}`}
                    accept=".pdf"
                    className="w-full text-xs border border-zinc-200 rounded-sm px-2"
                    onChange={handleFileChange(index, item.file_type, true)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-700 text-xs text-center">
              No se requiere archivos
            </p>
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
      <ConfirmModal
        openModal={openModal}
        title="Eliminar Archivo"
        text="¿Está seguro que desea eliminar este archivo?"
        onAction={removeFile}
        setOpenModal={setOpenModal}
      />
      <ConfirmModal
        openModal={openModalShow}
        title="Visualizar Archivo"
        text={`¿Está seguro que desar ${
          selectFileStatus ? "ocultar" : "mostrar "
        } el archivo?`}
        textButton="Cambiar"
        onAction={changeFileStatus}
        setOpenModal={setOpenModalShow}
      />
    </>
  );
};

export default ProductForm;
