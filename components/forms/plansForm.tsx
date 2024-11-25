import { useFieldArray, useForm } from "react-hook-form";
import { InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { planSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { IPlan } from "@/types/api";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import EditorText from "../ui/editorText";

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

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (data) {
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

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = {
      name: data.name,
      price: Number(data.price),
      description: data.description,
      featured_products: Number(data.num_features_products),
      products_limit: Number(data.num_products),
      events_limit: Number(data.num_features_events),
      news_limit: Number(data.num_features_news),
      benefits: data.benefits,
      banners_intern_limit: Number(data.banners_intern),
      banners_product_limit: Number(data.banners_product),
    };

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
      } catch (error) {
        console.error(error);
        // if (axios.isAxiosError(error)) {
        //   console.log(error.response?.data);
        // }
        reject({ message: "No se pudo registrar el plan" });
      } finally {
        closeModal();
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
        {/* <EditorHtml
          text="Descripción"
          id="description"
          value={getValues("description")}
          // register={register("description")}
          setValue={setValue}
          error={errors.description}
        /> */}
        <InputZodField
          id="num_features_products"
          name="Productos destacados"
          placeholder="5"
          register={register("num_features_products")}
          error={errors.num_features_products}
        />
        <InputZodField
          id="num_products"
          name="Número de productos"
          placeholder="5"
          register={register("num_products")}
          error={errors.num_products}
        />
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
