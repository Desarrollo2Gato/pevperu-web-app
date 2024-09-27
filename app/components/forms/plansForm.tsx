import { useFieldArray, useForm } from "react-hook-form";
import { InputField, InputZodField, TextAreaZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { categorySaveSchema, planSaveSchema } from "@/app/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { IPlan } from "@/app/types/api";
import ButtonArrayForm from "../ui/buttonArrayFrom";
import EditorHtml from "../ui/editotrHtml";

type PlanFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
};

const PlanForm: React.FC<PlanFormProps> = ({ type, id, token, closeModal }) => {
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
        num_features_events: data.events_limit.toString() || "",
        num_features_news: data.news_limit.toString() || "",
        benefits: data.benefits || [{ title: "", description: "" }],
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
      // company_id: data.companyId,
      // plan_id: data.plan,
    };

    const promise = new Promise(async (resolve, reject) => {
      console.log(dataSend);
      try {
        if (type === "create") {
          console.log("create");
          await axios.post(apiUrls.plan.create, dataSend, {
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
            await axios.put(apiUrls.plan.update(id?.toString()), dataSend, {
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
        <EditorHtml
          text="Descripción"
          id="description"
          value={getValues("description")}
          // register={register("description")}
          setValue={setValue}
          error={errors.description}
        />
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

export default PlanForm;
