import { useForm } from "react-hook-form";
import { InputField, InputZodField } from "../ui/inputField";
import { zodResolver } from "@hookform/resolvers/zod";
import { subscriptionSaveSchema } from "@/utils/shcemas/Admin";
import { useEffect, useState } from "react";
import {
  ICompany,
  IIndependentSubscription,
  IPlan,
  ISubscription,
  IUser,
} from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";

type IndependentSubsFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const IndependentSubsForm: React.FC<IndependentSubsFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [data, setData] = useState<IIndependentSubscription>();
  const [userData, setUserData] = useState<IUser[]>([]);
  const [plansData, setPlansData] = useState<IIndependentSubscription[]>([]);

  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [planLoading, setPlanLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(subscriptionSaveSchema),
    defaultValues: {
      companyId: "",
      plan: "",
      startDate: "",
      endDate: "",
      status: "true",
    },
  });
  useEffect(() => {
    getUserData();
    getPlanData();
  }, []);

  useEffect(() => {
    if (type === "edit") {
      if (id) getDataById(id?.toString());
    }
  }, [type, id]);

  useEffect(() => {
    if (data && userData.length > 0 && plansData.length > 0) {
      reset({
        companyId: data.user ? data.user.id.toString() : "",
        plan: data.independent_plan_id
          ? data.independent_plan_id.toString()
          : "",
        startDate: data?.start_date
          ? new Date(data.start_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        endDate: data?.end_date
          ? new Date(data.end_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        status: data.is_active ? "true" : "false",
      });
    }
  }, [data, userData, plansData]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.independentSubscription.getOne(id), {
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

  const getUserData = async () => {
    setUserLoading(true);
    try {
      const res = await axios.get(`${apiUrls.user.getAll}?type=extern`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos");
    } finally {
      setUserLoading(false);
    }
  };
  const getPlanData = async () => {
    setPlanLoading(true);
    try {
      const res = await axios.get(apiUrls.independentPlan.getAll, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPlansData(res.data);
    } catch (error) {
      console.error(error);
      alert("Error al obtener los datos");
    } finally {
      setPlanLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    console.log(data);
    const dataSend = {
      user_id: data.companyId,
      independent_plan_id: data.plan,
      start_date: formatDateToISO(data.startDate),
      end_date: formatDateToISO(data.endDate),
      is_active: data.status === "true" ? true : false,
    };

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.independentSubscription.create, dataSend, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          resolve({ message: "Suscripción creada exitosamente" });
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
            resolve({ message: "Suscripción actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la suscripción");
          }
        }
        closeModal();
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error.response?.data?.error || "Ha ocurrido un error inesperado.";
          reject({ message: errorMessage });
        } else {
          reject({
            message: "Error desconocido. Inténtalo nuevamente más tarde.",
          });
        }
      } finally {
        getData();
        setSubmitting(false);
      }
    });
    toast.promise(promise, {
      loading: "Guardando datos...",
      success: (data: any) => `${data.message}`,
      error: (data: any) => `${data.message}`,
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
          id="companyId"
          name="Empresa"
          options={userData}
          placeholder="Seleccione una empresa"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.full_name}
          register={register("companyId")}
          error={errors.companyId}
        />
        <SelectZodField
          id="plan"
          name="Plan"
          options={plansData}
          placeholder="Seleccione una plan"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("plan")}
          error={errors.plan}
        />
        <InputZodField
          id="startDate"
          name="Fecha de inicio"
          type="date"
          register={register("startDate")}
          error={errors.startDate}
        />
        <InputZodField
          id="endDate"
          name="Fecha de fin"
          type="date"
          register={register("endDate")}
          error={errors.endDate}
        />
        <SelectZodField
          id="status"
          name="Estado"
          options={[
            { id: "true", name: "Activo" },
            { id: "false", name: "Inactivo" },
          ]}
          placeholder="Seleccione un estado"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("status")}
          error={errors.status}
        />
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

export default IndependentSubsForm;
