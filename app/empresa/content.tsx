"use client";
import { useAuthContext } from "@/context/authContext";
import { InputZodField, TextAreaZodField } from "../../components/ui/inputField";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CompanyUpdateSchema } from "../../utils/shcemas/Auth";
import { useEffect, useState } from "react";
import { apiUrls } from "../../utils/api/apiUrls";
import axios from "axios";
import { IUser, TDepartment, TProfession } from "../../types/api";
import { getTokenFromCookie } from "../../utils/api/getToken";
import { SelectZodField } from "../../components/ui/selectField";
import { MainContainer, SafeAreaContainer } from "../../components/ui/containers";
import ButtonArrayForm from "../../components/ui/buttonArrayFrom";
import Image from "next/image";

import { FaRegImage } from "react-icons/fa6";
import { toast } from "sonner";
import { imgUrl } from "../../utils/img/imgUrl";

const ContentCompany = () => {
  const { user, refreshToken } = useAuthContext();

  const [token, setToken] = useState<string | null>(null);

  const [dataUser, setDataUser] = useState<IUser>();
  const [businessData, setBusinessData] = useState<TProfession[]>([]);
  const [departmentsData, setDepartmentsData] = useState<TDepartment[]>([]);
  const [branchProvinces, setBranchProvinces] = useState<any[]>([]);
  const [branchDistricts, setBranchDistricts] = useState<any[]>([]);

  // img
  const [imgLogo, setImgLogo] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [gettingBusiness, setGettingBusiness] = useState<boolean>(false);
  const [gettingDepartments, setGettingDepartments] = useState<boolean>(false);
  const [gettingProvinces, setGettingProvinces] = useState<boolean>(false);
  const [gettingDistricts, setGettingDistricts] = useState<boolean>(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token.toString());
    }
  }, []);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(CompanyUpdateSchema),
    defaultValues: {
      fullName: "",
      company: "",
      ruc: "",
      phoneNumber: "",
      description: "",
      website: "",
      email: "",
      businessFieldId: "",
      businessHours: "",
      logo: null,
      branchesInfo: [
        {
          department: "",
          province: "",
          district: "",
          address: "",
          name: "",
          phone: "",
          email: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "branchesInfo",
  });

  useEffect(() => {
    if (token) {
      getData();
      getDepartments();
    }
    getBusinessData();
  }, [token]);

  useEffect(() => {
    if (dataUser) {
      if (dataUser?.company?.logo) {
        setImgLogo(imgUrl(dataUser.company.logo));
      }
      const branches = dataUser.company.branches_info || [];
      branches.forEach(async (branch, index) => {
        if (branch.department) {
          getProvinces(branch.department, index);
        }
        if (branch.province) {
          getDistricts(branch.province, index);
        }
      });
      reset({
        fullName: dataUser.full_name || "",
        company: dataUser.company?.name || "",
        ruc: dataUser.company.ruc || "",
        phoneNumber: dataUser.company.phone_number || "",
        description: dataUser.company.description || "",
        website: dataUser.company.website || "",
        email: dataUser.email || "",
        logo: null,
        businessHours: dataUser.company.business_hours || "",
        businessFieldId: dataUser.company.business_field_id || "",
        branchesInfo: dataUser.company.branches_info || [
          {
            department: "",
            province: "",
            district: "",
            address: "",
            name: "",
            phone: "",
            email: "",
          },
        ],
      });
    }
  }, [dataUser]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        apiUrls.auth.me,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDataUser(res.data.user);
    } catch (error) {
      toast.error("Error al obtener los datos");
    } finally {
      setLoading(false);
    }
  };

  const getBusinessData = async () => {
    setGettingBusiness(true);
    try {
      const res = await axios.get(apiUrls.businessField.getAll);
      setGettingBusiness(false);
      setBusinessData(res.data);
    } catch (error) {
      setGettingBusiness(false);
      toast.error("Error al obtener los rubros");
    }
  };

  const getDepartments = async () => {
    setGettingDepartments(true);
    try {
      const res = await axios.get(apiUrls.location.department, {
        headers: {
          Authorization: `Bearer ` + token,
        },
      });
      setDepartmentsData(res.data);
    } catch (error) {
      toast.error("Error al obtener los departamentos");
    } finally {
      setGettingDepartments(false);
    }
  };
  const getProvinces = async (id: string, index: number) => {
    setGettingProvinces(true);
    try {
      const res = await axios.get(apiUrls.location.province(id), {
        headers: {
          Authorization: `Bearer ` + token,
        },
      });
      setBranchProvinces((prev) => {
        const newProvinces = [...prev];
        newProvinces[index] = res.data.provinces;
        return newProvinces;
      });
    } catch (error) {
      toast.error("Error al obtener provincias");
    } finally {
      setGettingProvinces(false);
    }
  };

  const getDistricts = async (id: string, index: number) => {
    setGettingDistricts(true);
    try {
      const res = await axios.get(apiUrls.location.district(id), {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBranchDistricts((prev) => {
        const newDistricts = [...prev];
        newDistricts[index] = res.data.districts;
        return newDistricts;
      });
    } catch (error) {
      toast.error("Error al obtener distritos");
    } finally {
      setGettingDistricts(false);
    }
  };

  const onSubmit = (data: any) => {
    setSending(true);
    const formData = new FormData();
    formData.append("name", data.company);
    formData.append("ruc", data.ruc);
    formData.append("phone_number", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("description", data.description);
    formData.append("business_hours", data.businessHours);
    formData.append("website", data.website);
    formData.append("business_field_id", data.businessFieldId);
    formData.append("status", "approved");
    data.branchesInfo.forEach((branch: any, index: number) => {
      formData.append(`branches_info[${index}][department]`, branch.department);
      formData.append(`branches_info[${index}][province]`, branch.province);
      formData.append(`branches_info[${index}][district]`, branch.district);
      formData.append(`branches_info[${index}][address]`, branch.address);
      formData.append(`branches_info[${index}][name]`, branch.name);
      formData.append(
        `branches_info[${index}][phone]`,
        branch.phone ? branch.phone : ""
      );
      formData.append(
        `branches_info[${index}][email]`,
        branch.email ? branch.email : ""
      );
    });

    formData.append("user[full_name]", data.fullName);
    if (data.logo) {
      formData.append("logo", data.logo[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (user?.company_id) {
          await axios.post(
            apiUrls.company.update(user.company_id.toString()),
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          resolve({ message: "Se actualizo correctamente" });
        } else {
          reject({ message: "No se pudo obtener id de la empresa" });
        }
      } catch (error) {
        reject({ message: "Error al actualizar la empresa" });
      } finally {
        refreshToken;
        setSending(false);
      }
    });
    toast.promise(promise, {
      loading: "Guardando datos...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };
  useEffect(() => {
    if (watch("logo")) {
      const file = watch("logo");
      if (file === null) return;
      const imgUrl = URL.createObjectURL(file[0]);
      setImgLogo(imgUrl);
    }
  }, [watch("logo")]);

  return (
    <SafeAreaContainer>
      <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col gap-4">
        <MainContainer title="Datos de usuario">
          <div className="flex justify-center items-center mb-8">
            {imgLogo ? (
              <div className="relative">
                <Image
                  priority
                  src={imgLogo}
                  height={100}
                  width={100}
                  alt="Perfil del usuario"
                  className="rounded-[100%] h-32 w-32 border border-zinc-200 object-cover"
                />
                <label
                  htmlFor="logo"
                  className="w-10 h-10 absolute bottom-1 right-1 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
                >
                  <FaRegImage className="text-zinc-200 text-lg " />
                  <input
                    id="logo"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    {...register("logo")}
                    // onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-zinc-200 rounded-[100%] h-32 w-32 flex justify-center items-center relative">
                <FaRegImage className="text-zinc-200 text-4xl" />
                <label
                  htmlFor="logo"
                  className="w-10 h-10 absolute bottom-1 right-1 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
                >
                  <FaRegImage className="text-zinc-200 text-lg " />
                  <input
                    id="logo"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    {...register("logo")}
                  />
                </label>
              </div>
            )}
            {errors.logo && (
              <div className="text-red-500 text-sm">{errors.logo.message}</div>
            )}
          </div>
          <div className=" grid md:grid-cols-2 gap-4">
            <InputZodField
              id="fullName"
              name="Nombre"
              placeholder="Ingrese su nombre"
              register={register("fullName")}
              error={errors.fullName}
            />
            <InputZodField
              id="email"
              name="Correo"
              placeholder="Ingrese su correo"
              register={register("email")}
              error={errors.email}
            />
          </div>
        </MainContainer>
        <MainContainer title="Datos de la empresa">
          <div className=" grid md:grid-cols-2 gap-4 mb-4">
            <InputZodField
              id="company"
              name="Nombre de la empresa"
              placeholder="Nombre de la empresa"
              register={register("company")}
              error={errors.company}
            />
            <InputZodField
              id="ruc"
              name="RUC"
              placeholder="RUC"
              register={register("ruc")}
              error={errors.ruc}
            />

            <SelectZodField
              id="businessFieldId"
              name="Rubro"
              options={businessData}
              placeholder="Seleccione un rubro"
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.name}
              register={register("businessFieldId")}
              error={errors.businessFieldId}
            />
            <InputZodField
              id="phoneNumber"
              name="Teléfono"
              placeholder="Teléfono"
              register={register("phoneNumber")}
              error={errors.phoneNumber}
            />
            <InputZodField
              id="website"
              name="Sitio web"
              placeholder="Sitio web"
              register={register("website")}
              error={errors.website}
            />
            <InputZodField
              id="businessHours"
              name="Horario de atención"
              placeholder="Horario de atención"
              register={register("businessHours")}
              error={errors.businessHours}
            />
          </div>
          <TextAreaZodField
            id="description"
            name="Descripción"
            placeholder="Descripción de la empresa"
            register={register("description")}
            error={errors.description}
          />
        </MainContainer>
        <MainContainer title="Sucursales">
          {fields.map((field, index) => (
            <div key={field.id} className="gap-4">
              <div className="border border-zinc-300 rounded-lg p-4 flex flex-col items-start gap-4 mb-4 ">
                <h3>Sede {index + 1}</h3>
                <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-4">
                  <SelectZodField
                    id={`branchesInfo.${index}.department`}
                    name="Departamento"
                    options={departmentsData}
                    placeholder="Seleccione un departamento"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    onChange={(option) => {
                      const value = option.target.value;
                      getProvinces(value, index);
                    }}
                    register={register(`branchesInfo.${index}.department`)}
                    error={errors.branchesInfo?.[index]?.department}
                  />
                  <SelectZodField
                    id={`branchesInfo.${index}..province`}
                    name="Provincia"
                    options={branchProvinces[index] || []}
                    placeholder="Seleccione una provincia"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    onChange={(option) => {
                      const value = option.target.value;
                      getDistricts(value, index);
                    }}
                    register={register(`branchesInfo.${index}.province`)}
                    error={errors.branchesInfo?.[index]?.province}
                  />
                  <SelectZodField
                    id={`branchesInfo.${index}.district`}
                    name="Distrito"
                    options={branchDistricts[index] || []}
                    placeholder="Seleccione un distrito"
                    getOptionValue={(option) => option.id}
                    getOptionLabel={(option) => option.name}
                    register={register(`branchesInfo.${index}.district`)}
                    error={errors.branchesInfo?.[index]?.district}
                  />
                </div>
                <InputZodField
                  id={`branchesInfo.${index}.address`}
                  name="Dirección"
                  placeholder="Dirección"
                  register={register(`branchesInfo.${index}.address`)}
                  error={errors.branchesInfo?.[index]?.address}
                />
                <div className="grid grid-cols-1 w-full md:grid-cols-3 gap-4">
                  <InputZodField
                    id={`branchesInfo.${index}.name`}
                    name="Nombre"
                    placeholder="Nombre"
                    register={register(`branchesInfo.${index}.name`)}
                    error={errors.branchesInfo?.[index]?.name}
                  />
                  <InputZodField
                    id={`branchesInfo.${index}.phone`}
                    name="Teléfono"
                    placeholder="Teléfono"
                    register={register(`branchesInfo.${index}.phone`)}
                    error={errors.branchesInfo?.[index]?.phone}
                  />
                  <InputZodField
                    id={`branchesInfo.${index}.email`}
                    name="Correo"
                    isrequired={false}
                    placeholder="Correo"
                    register={register(`branchesInfo.${index}.email`)}
                    error={errors.branchesInfo?.[index]?.email}
                  />
                </div>
                {fields.length > 1 && (
                  <ButtonArrayForm
                    text="Eliminar"
                    type="button"
                    isDelete
                    onClick={() => remove(index)}
                  />
                )}
              </div>
            </div>
          ))}

          <div className="flex justify-end gap-4">
            <ButtonArrayForm
              type="button"
              text="Agregar"
              onClick={() =>
                append({
                  department: "",
                  province: "",
                  district: "",
                  address: "",
                  name: "",
                  phone: "",
                  email: "",
                })
              }
            />
          </div>
        </MainContainer>
        <button
          type="submit"
          className="bg-green-950 text-white py-2 px-6 rounded-lg self-end mt-4"
        >
          Guardar Cambios
        </button>
      </form>
    </SafeAreaContainer>
  );
};

export default ContentCompany;
