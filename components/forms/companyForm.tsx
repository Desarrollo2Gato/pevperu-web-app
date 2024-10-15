import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { toast } from "sonner";
import { SelectZodField } from "../ui/selectField";
import ButtonForm from "../ui/buttonForm";
import { ICompany, TProfession } from "@/types/api";
import { ImgField } from "../ui/imgField";
import { imgUrl } from "@/utils/img/imgUrl";
import { CompanyRegisterSchema } from "@/utils/shcemas/Auth";
import { InputZodField } from "../ui/inputField";

type CompanyFormProps = {
  type: "create" | "edit";
  id?: number | null;
  token: string;
  closeModal: () => void;
  getData: () => void;
};

const CompanyForm: React.FC<CompanyFormProps> = ({
  type,
  id,
  token,
  closeModal,
  getData,
}) => {
  const [data, setData] = useState<ICompany>();
  const [businessField, setBusinessField] = useState<TProfession[]>([]);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [logo, setLogo] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(CompanyRegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      // password: "",
      businessFieldId: "",
      company: "",
      ruc: "",
      phone: "",
      logo: null,
    },
  });

  useEffect(() => {
    getBusinessField();
  }, []);

  useEffect(() => {
    if (type === "edit" && id) {
      getDataById(id?.toString());
    }
  }, [id, type]);

  useEffect(() => {
    if (data) {
      if (data.logo) {
        setLogo(imgUrl(data.logo));
      }
      reset({
        fullName: data.owner_full_name || "",
        email: data.email || "",
        businessFieldId: data.business_field_id.toString() || "",
        company: data.name || "",
        ruc: data.ruc || "",
        phone: data.phone_number || "",
        logo: null,
        // password: "",
      });
    }
  }, [data]);

  const getDataById = async (id: string) => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.company.getOne(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setData(res.data);
    } catch (error) {
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const getBusinessField = async () => {
    try {
      const res = await axios.get(apiUrls.businessField.getAll);
      setBusinessField(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error al obtener los filtros");
    }
  };

  const onSubmit = async (data: any) => {
    setSubmitting(true);
    const dataSend = new FormData();
    dataSend.append("full_name", data.fullName);
    dataSend.append("company[email]", data.email);
    dataSend.append("company[phone_number]", data.phone);
    dataSend.append("company[name]", data.company);
    dataSend.append("company[ruc]", data.ruc);
    dataSend.append("company[business_field_id]", data.businessFieldId);
    if (type === "create") {
      dataSend.append("password", "password123");
    }
    if (data.logo) {
      dataSend.append("company[logo]", data.logo[0]);
    }
    const dataSend2 = new FormData();
    dataSend2.append("user[full_name]", data.fullName);
    dataSend2.append("email", data.email);
    dataSend2.append("phone_number", data.phone);
    dataSend2.append("name", data.company);
    dataSend2.append("ruc", data.ruc);
    dataSend2.append("business_field_id", data.businessFieldId);
    if (data.logo) {
      dataSend2.append("logo", data.logo[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (type === "create") {
          await axios.post(apiUrls.auth.registerWithCompany, dataSend, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          resolve({ message: "Empresa creada exitosamente" });
        }
        if (type === "edit") {
          if (id) {
            await axios.post(
              apiUrls.company.update(id?.toString()),
              dataSend2,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            resolve({ message: "Empresa actualizada exitosamente" });
          } else {
            reject("No se ha podido obtener el id de la empresa");
          }
        }
        closeModal();
      } catch (error) {
        // if (axios.isAxiosError(error)) {
        //   console.log("error api", error);
        //   console.log("error api", error.response?.data);
        // }
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
            id="logo"
            imgLogo={logo}
            register={register("logo")}
            error={errors.logo}
            watch={watch("logo")}
            setImgLogo={setLogo}
            iscategory
          />
        </div>
        <InputZodField
          id="email"
          name="Correo"
          type="email"
          placeholder="correo@example.com"
          register={register("email")}
          error={errors.email}
        />
        <InputZodField
          id="company"
          name="Nombre"
          placeholder="Nombre de la empresa"
          register={register("company")}
          error={errors.company}
        />
        <InputZodField
          id="ruc"
          name="RUC"
          placeholder="RUC de la empresa"
          register={register("ruc")}
          error={errors.ruc}
          max={11}
        />
        <InputZodField
          id="phone"
          name="Número de celular"
          placeholder="Número de celular"
          register={register("phone")}
          error={errors.phone}
          max={9}
        />
        <SelectZodField
          id="businessFieldId"
          name="Rubro"
          options={businessField}
          placeholder="Seleccione un rubro"
          getOptionValue={(option) => option.id}
          getOptionLabel={(option) => option.name}
          register={register("businessFieldId")}
          error={errors.businessFieldId}
        />
        <InputZodField
          id="fullName"
          name="Nombre del encargado"
          placeholder="Nombre Apellido"
          register={register("fullName")}
          error={errors.fullName}
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

export default CompanyForm;
