import { useFieldArray, useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { ICategory, IPlan } from "@/types/api";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import EditorText from "../ui/editorText";
import { SelectZodField } from "../ui/selectField";
import { RadioBooleanField } from "./radioButton";

type PlanFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const PlanForm: React.FC<PlanFormProps> = ({
  type,
  getData,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<IPlan>();
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [gettingCategories, setGettingCategories] = useState<boolean>(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(planSaveSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      num_features_products: "",
      num_products: "",
      num_features_events: "",
      num_features_news: "",
      benefits: [{ title: "", description: "" }],
      banners_intern: "",
      banners_product: "",
      num_jobs: "",
      show_product_specifications: "false",
      show_supplier_description: "false",
      supplier_branches_limit: "",
      show_in_directory: "false",
      related_products_limit: "",
      show_phone: "false",
      show_email: "false",
      show_website: "false",
      category_limits: [{ category_id: "", product_limit: "" }],
    },
  });

  const {
    fields: benefitsFields,
    append: benefitsAppend,
    remove: benefitsRemove,
  } = useFieldArray({
    control,
    name: "benefits",
  });
  const {
    fields: categoryLimitsFields,
    append: categoryLimitsAppend,
    remove: categoryLimitsRemove,
  } = useFieldArray({
    control,
    name: "category_limits",
  });

  useEffect(() => {
    getCategories();
  }, []);

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (data) {
      console.log(data);
      reset({
        name: data.name || "",
        description: data.description || "",
        price: data.price.toString() || "",
        num_features_products: data.featured_products.toString() || "",
        num_products: data.products_limit.toString() || "",
        num_jobs: data.jobs_limit.toString() || "",
        num_features_events: data.events_limit.toString() || "",
        num_features_news: data.news_limit.toString() || "",
        benefits: data.benefits || [{ title: "", description: "" }],
        banners_intern: data.banners_intern_limit.toString() || "",
        banners_product: data.banners_product_limit.toString() || "",
        show_product_specifications:
          Boolean(data.show_product_specifications).toString() || "false",
        show_supplier_description:
          Boolean(data.show_supplier_description).toString() || "false",
        supplier_branches_limit: data.supplier_branches_limit.toString() || "",
        show_in_directory:
          Boolean(data.show_in_directory).toString() || "false",
        related_products_limit: data.related_products_limit.toString() || "",
        show_phone: Boolean(data.show_phone).toString() || "false",
        show_email: Boolean(data.show_email).toString() || "false",
        show_website: Boolean(data.show_website).toString() || "false",
        category_limits: (
          data.category_limits || [{ category_id: "", product_limit: "" }]
        ).map((limit) => ({
          category_id: String(limit.category_id),
          product_limit: String(limit.product_limit),
        })),
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.plan.getOne(id), {
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
  const getCategories = async () => {
    setGettingCategories(true);
    try {
      const res = await axios.get(apiUrls.category.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error al obtener las categorias");
      }
    } finally {
      setGettingCategories(false);
    }
  };

  const onSubmit = async (data: any) => {
    // setSubmitting(true);
    console.log("data", data.category_limits);
    const dataSend: Record<string, any> = {
      name: data.name,
      price: Number(data.price),
      description: data.description,
      featured_products: Number(data.num_features_products),
      products_limit: Number(data.num_products),
      jobs_limit: Number(data.num_jobs),
      events_limit: Number(data.num_features_events),
      news_limit: Number(data.num_features_news),
      benefits: data.benefits,
      banners_intern_limit: Number(data.banners_intern),
      banners_product_limit: Number(data.banners_product),
      show_product_specifications: Boolean(data.show_product_specifications),
      show_supplier_description: Boolean(data.show_supplier_description),
      supplier_branches_limit: Number(data.supplier_branches_limit),
      show_in_directory: Boolean(data.show_in_directory),
      related_products_limit: Number(data.related_products_limit),
      show_phone: Boolean(data.show_phone),
      show_email: Boolean(data.show_email),
      show_website: Boolean(data.show_website),
      categories_limits: data.category_limits,
    };
    // data.category_limits.forEach((limit: any, index: number) => {
    //   dataSend[`categories_limits[${index}][category_id]`] = Number(
    //     limit.category_id
    //   );
    //   dataSend[`categories_limits[${index}][product_limit]`] =
    //     limit.product_limit;
    // });

    console.log("dataSend", dataSend);

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.plan.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          getData();
          resolve({ message: "Plan creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.put(apiUrls.plan.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            resolve({ message: "Plan actualizado exitosamente" });
          } else {
            reject({
              message: "No se ha podido obtener el id del plan",
            });
          }
        }
        closeModal();
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "No se pudo registrar el plan" });
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
  useEffect(() => {
    console.log(watch("show_email"));
  }, [watch("show_email")]);

  return (
    <>
      <form className="flex flex-col gap-3 mt-4">
        <InputZodField
          id="name"
          name="Nombre"
          placeholder="Nombre del plan"
          register={register("name")}
          error={errors.name}
        />
        <InputZodField
          id="price"
          name="Precio"
          placeholder="0.00"
          register={register("price")}
          error={errors.price}
        />
        {/* description */}
        <EditorText
          id="description"
          value={getValues("description")}
          setValue={setValue}
          onChange={(value: string) => setValue("description", value)}
          text="Descripción"
          error={errors.description}
        />

        <div className=" ">
          {/* category_limits: [{ category_id: "", product_limit: "" }], */}
          <h2 className="text-zinc-500 font-medium mb-2">Productos</h2>
          <div className="border border-stone-200 rounded-md p-2 flex flex-col gap-3">
            <div className="grid md:grid-cols-2 gap-4">
              <InputZodField
                id="num_features_products"
                name="Productos destacados"
                placeholder="5"
                register={register("num_features_products")}
                error={errors.num_features_products}
              />
              <RadioBooleanField
                id="show_product_specifications"
                name="Mostrar especificaciones"
                register={register("show_product_specifications")}
                error={errors.show_product_specifications}
              />
            </div>
          </div>
        </div>
        <div className=" ">
          {/* category_limits: [{ category_id: "", product_limit: "" }], */}
          <h2 className="text-zinc-500 font-medium mb-2">
            Limitaciones por categoría
          </h2>
          <div className="border border-stone-200 rounded-md p-2 flex flex-col gap-3">
            {categories.map((field, index) => (
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                key={index}
              >
                <SelectZodField
                  id={`category_limits-${index}-category_id`}
                  options={categories.map((category) => ({
                    value: category.id.toString(),
                    label: category.name.toString(),
                  }))}
                  name={field.name}
                  defaultValue={field.id.toString()}
                  placeholder="Seleccione una categoría"
                  register={register(`category_limits.${index}.category_id`)}
                  error={errors.category_limits?.[index]?.category_id}
                />
                <InputZodField
                  id={`category_limits${index}.product_limit`}
                  name="Número de productos"
                  placeholder="5"
                  register={register(`category_limits.${index}.product_limit`)}
                  error={errors.category_limits?.[index]?.product_limit}
                />
              </div>
            ))}
          </div>
        </div>

        <div className=" ">
          <h2 className=" text-zinc-500 font-medium mb-2">Proveedores</h2>
          <div className="border border-stone-200 rounded-md p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <RadioBooleanField
              id="show_in_directory"
              name="Mostrar en el directorio"
              register={register("show_in_directory")}
              error={errors.show_in_directory}
            />
            <RadioBooleanField
              id="show_supplier_description"
              name="Mostrar descripcion"
              register={register("show_supplier_description")}
              error={errors.show_supplier_description}
            />
            <RadioBooleanField
              id="show_email"
              name="Mostrar correo"
              register={register("show_email")}
              error={errors.show_email}
            />
            <RadioBooleanField
              id="show_phone"
              name="Mostrar Número celular"
              register={register("show_phone")}
              error={errors.show_phone}
            />
            <RadioBooleanField
              id="show_website"
              name="Mostrar sito web"
              register={register("show_website")}
              error={errors.show_website}
            />
             <InputZodField
                id="num_products"
                name="Número de productos a mostrar"
                placeholder="5"
                register={register("num_products")}
                error={errors.num_products}
              />
          </div>
        </div>
        <div className=" ">
          <h2 className=" text-zinc-500 font-medium mb-2">Otros</h2>
          <div className="border border-stone-200 rounded-md p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputZodField
              id="num_features_events"
              name="Número de eventos"
              placeholder="5"
              register={register("num_features_events")}
              error={errors.num_features_events}
            />
            <InputZodField
              id="num_features_news"
              name="Número de noticias"
              placeholder="5"
              register={register("num_features_news")}
              error={errors.num_features_news}
            />
            <InputZodField
              id="num_jobs"
              name="Número de empleos por mes"
              placeholder="5"
              register={register("num_jobs")}
              error={errors.num_jobs}
            />
          </div>
        </div>
        <div className=" ">
          <h2 className=" text-zinc-500 font-medium mb-2">Publicidad</h2>
          <div className="border border-stone-200 rounded-md p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputZodField
              id="banner_intern"
              name="Número de anuncios en la navegación"
              placeholder="5"
              register={register("banners_intern")}
              error={errors.banners_intern}
            />
            <InputZodField
              id="banners_product"
              name="Número anuncios para productos"
              placeholder="5"
              register={register("banners_product")}
              error={errors.banners_product}
            />
          </div>
        </div>

        {/* benefits */}
        <div className="flex flex-col gap-2">
          <h2 className=" font-medium text-zinc-500">Beneficios</h2>
          {benefitsFields.map((field, index) => (
            <div
              key={field.id}
              className="flex flex-col gap-2 border border-zinc-300 rounded-md p-4"
            >
              <InputZodField
                id={`benefits${index}.title`}
                name="Título"
                placeholder="Título del beneficio"
                register={register(`benefits.${index}.title`)}
                error={errors.benefits?.[index]?.title}
              />
              <TextAreaZodField
                id={`benefits${index}.description`}
                name="Descripción"
                placeholder="Descripción del beneficio"
                register={register(`benefits.${index}.description`)}
                error={errors.benefits?.[index]?.description}
              />
              <div className="flex items-center gap-2">
                {benefitsFields.length > 1 && (
                  <ButtonArrayForm
                    text="Eliminar"
                    onClick={() => benefitsRemove(index)}
                    isDelete
                  />
                )}
              </div>
            </div>
          ))}
          <ButtonArrayForm
            text="Agregar"
            onClick={() => benefitsAppend({ title: "", description: "" })}
          />
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
            isdisabled={submitting}
            onClick={handleSubmit(onSubmit)}
            primary
          />
        </div>
      </form>
    </>
  );
};

export default PlanForm;
