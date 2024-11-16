"use client";
import { useAuthContext } from "@/context/authContext";
import { InputZodField } from "../../components/ui/inputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PersonUpdateSchema, publisherSchema } from "../../utils/shcemas/Auth";
import { useEffect, useState } from "react";
import { apiUrls } from "../../utils/api/apiUrls";
import axios from "axios";
import { IUser, TProfession } from "../../types/api";
import { getTokenFromCookie } from "../../utils/api/getToken";
import { SelectZodField } from "../../components/ui/selectField";
import {
  MainContainer,
  SafeAreaContainer,
} from "../../components/ui/containers";
import Image from "next/image";

import { FaRegImage } from "react-icons/fa6";
import { toast } from "sonner";
import { imgUrl } from "../../utils/img/imgUrl";

const Content = () => {
  const { user, refreshToken } = useAuthContext();

  const [token, setToken] = useState<string | null>(null);

  const [dataUser, setDataUser] = useState<IUser>();
  const [professionData, setProfessionData] = useState<TProfession[]>([]);
  // img
  const [imgLogo, setImgLogo] = useState<any | null>(null);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const [gettinProfesion, setGettinProfession] = useState<boolean>(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token.toString());
    }
  }, []);

  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(PersonUpdateSchema),
    defaultValues: {
      fullName: "",
      profession_id: "",
      email: "",
      workForCompany: "",
      image: null,
    },
  });

  useEffect(() => {
    getProfession();
  }, []);

  useEffect(() => {
    if (dataUser) {
      if (dataUser?.photo) {
        setImgLogo(imgUrl(dataUser.photo));
      }
      reset({
        fullName: dataUser.full_name || "",
        email: dataUser.email || "",
        profession_id: dataUser.profession_id || "",
        workForCompany: dataUser.work_for_company || "",
        image: null,
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
      console.log(res.data.user);
      setDataUser(res.data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else {
        toast.error("Error al obtener los datos");
      }
    } finally {
      setLoading(false);
    }
  };

  const getProfession = async () => {
    setGettinProfession(true);
    try {
      const res = await axios.get(apiUrls.profession.getAll);
      setProfessionData(res.data);
    } catch (error) {
      toast.error("No se pudo obtener las profesiones");
    } finally {
      setGettinProfession(false);
    }
  };

  const onSubmit = (data: any) => {
    setSending(true);
    const formData = new FormData();
    formData.append("full_name", data.fullName);
    formData.append("profession_id", data.profession_id);
    formData.append("phone_number", data.phoneNumber);
    formData.append("email", data.email);
    formData.append("work_for_company", data.workForCompany);
    formData.append("type", "extern");
    if (data.image) {
      formData.append("photo", data.image[0]);
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (user?.id) {
          await axios.post(apiUrls.user.update(user.id.toString()), formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });

          resolve({ message: "Se actualizo correctamente" });
        } else {
          reject({ message: "No se pudo obtener id del usuario" });
        }
      } catch (error) {
        reject({ message: "Error al actualizar sus datos" });
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
    const file = watch("image");
    if (watch("image")) {
      if (file === null) return;
      const imgUrl = URL.createObjectURL(file[0]);
      setImgLogo(imgUrl);
    }
  }, [watch("image")]);

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
                  className="rounded-[100%] h-32 w-32 border border-zinc-200 object-contain"
                />
                <label
                  htmlFor="image"
                  className="w-10 h-10 absolute bottom-1 right-1 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
                >
                  <FaRegImage className="text-zinc-200 text-lg " />
                  <input
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    {...register("image")}
                    // onChange={handleImageChange}
                  />
                </label>
              </div>
            ) : (
              <div className="border-2 border-zinc-200 rounded-[100%] h-32 w-32 flex justify-center items-center relative">
                <FaRegImage className="text-zinc-200 text-4xl" />
                <label
                  htmlFor="image"
                  className="w-10 h-10 absolute bottom-1 right-1 rounded-full bg-green-800 flex justify-center items-center z-10 shadow-md cursor-pointer "
                >
                  <FaRegImage className="text-zinc-200 text-lg " />
                  <input
                    id="image"
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                    {...register("image")}
                  />
                </label>
              </div>
            )}
            {errors.image && (
              <div className="text-red-500 text-sm">{errors.image.message}</div>
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
            <InputZodField
              id="workForCompany"
              name="Nombre de la empresa"
              placeholder="Nombre de la empresa"
              register={register("workForCompany")}
              error={errors.workForCompany}
            />
            <SelectZodField
              id="profession_id"
              name="Profesión"
              options={professionData}
              placeholder="Seleccione una profesión"
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => option.name}
              register={register("profession_id")}
              error={errors.profession_id}
            />
          </div>
        </MainContainer>
        <MainContainer >
            <ul><li></li></ul>
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

export default Content;
