import { useForm } from "react-hook-form";
import { InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { JobSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import ButtonForm from "../ui/buttonForm";
import { IJobs } from "@/types/api";
import { SelectZodField } from "../ui/selectField";
import EditorText from "../ui/editorText";
import { useAuthContext } from "@/context/authContext";

type JobFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const JobForm: React.FC<JobFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [job, setJob] = useState<IJobs>();

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { user } = useAuthContext();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(JobSchema),
    defaultValues: {
      title: "",
      modality: "",
      type: "",
      address: "",
      content: "",
      salary: "",
      link: "",
      email: "",
    },
  });

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (job) {
      reset({
        title: job.title || "",
        modality: job.modality || "",
        type: job.type || "",
        address: job.address || "",
        content: job.content || "",
        salary: job.salary || "",
        link: job.link || "",
        email: job.email || "",
      });
    }
  }, [job]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.jobs.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("empleo", res.data);
      setJob(res.data);
    } catch (error) {
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);

    const isUpdate = Boolean(job);
    const haveCompany = Boolean(user?.company_id);

    let autor_id: string | undefined;
    if (haveCompany) {
      autor_id = isUpdate
        ? job?.company.id.toString()
        : user?.company_id?.toString();
    } else {
      autor_id = isUpdate
        ? job?.extern_user_id.toString()
        : user?.id?.toString();
    }

    const dataSend = {
      title: data.title,
      modality: data.modality,
      type: data.type,
      content: data.content,
      salary: data.salary,
      address: data.adress,
      company_id: haveCompany ? autor_id : undefined,
      extern_user_id: !haveCompany ? autor_id : undefined,
      email: data.email,
      link: data.link,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.jobs.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          resolve({ message: "Empleo creado exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.put(apiUrls.jobs.update(id?.toString()), dataSend, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            resolve({ message: "Empleo actualizado exitosamente" });
          } else {
            reject("No se ha podido obtener el id del filtro");
          }
        }
        closeModal();
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
          reject({ message: error.response?.data.message });
        } else {
          reject({ message: "Error al guardar los datos" });
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
      <form className="flex flex-col gap-2 mt-4">
        <InputZodField
          id="title"
          name="Cargo"
          placeholder="Ingeniero Agrónomo"
          register={register("title")}
          error={errors.title}
        />
        <SelectZodField
          id="modality"
          options={["Presencial", "Remoto", "Híbrido"]}
          name="Modalidad"
          placeholder="Seleccione la modalidad"
          getOptionLabel={(item) => item}
          getOptionValue={(item) => item}
          register={register("modality")}
          error={errors.modality}
        />

        <InputZodField
          id="type"
          name="Tipo de empleo"
          placeholder="Tiempo completo"
          register={register("type")}
          error={errors.type}
        />
        <EditorText
          id="content"
          value={getValues("content")}
          setValue={setValue}
          onChange={(value: string) => setValue("content", value)}
          text="Contenido"
          error={errors.content}
        />
        <InputZodField
          id="address"
          name="Lugar de trabajo"
          placeholder="Lima"
          register={register("address")}
          error={errors.address}
        />
        <InputZodField
          id="salary"
          name="Salario"
          placeholder="1200.00"
          register={register("salary")}
          error={errors.salary}
        />
        <InputZodField
          id="email"
          type="email"
          name="Correo de contacto"
          placeholder="correo@examplo.com"
          register={register("email")}
          error={errors.email}
        />
        <InputZodField
          id="link"
          name="Enlace del empleo"
          placeholder="https://tu-enlace.com"
          register={register("link")}
          error={errors.link}
        />
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

export default JobForm;
