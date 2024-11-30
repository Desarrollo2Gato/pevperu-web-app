import { useForm } from "react-hook-form";
import { InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  independentPlanSaveSchema,
} from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { IIndependentPlan,  } from "@/types/api";
import EditorText from "../ui/editorText";

type IndependentPlanFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const IndependentPlanForm: React.FC<IndependentPlanFormProps> = ({
  type,
  getData,
  id,
  token,
  closeModal,
}) => {
  const [data, setData] = useState<IIndependentPlan>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(independentPlanSaveSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      num_features_events: "",
      num_features_news: "",
      num_jobs: "",
      num_courses: "",
    },
  });

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
        num_jobs: data.jobs_limit.toString() || "",
        num_features_events: data.events_limit.toString() || "",
        num_features_news: data.news_limit.toString() || "",
        num_courses: data.courses_limit?.toString() || "",
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.independentPlan.getOne(id), {
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
    // setSubmitting(true);
    console.log(data.num_courses);
    const dataSend: Record<string, any> = {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      events_limit: Number(data.num_features_events),
      courses_limit: Number(data.num_courses),
      news_limit: Number(data.num_features_news),
      jobs_limit: Number(data.num_jobs),
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.independentPlan.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          getData();
          resolve({ message: "Plan creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.put(
              apiUrls.independentPlan.update(id?.toString()),
              dataSend,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
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
            <InputZodField
              id="courses_limit"
              name="Número de cursos"
              placeholder="5"
              register={register("num_courses")}
              error={errors.num_courses}
            />
          </div>
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

export default IndependentPlanForm;
