"use client";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import axios, { isAxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthContext } from "@/context/authContext";
import { InputZodField } from "@/components/ui/inputField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectZodField } from "@/components/ui/selectField";
import { TProfession } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import { registerSchema } from "@/utils/shcemas/Auth";

const Content = () => {
  const router = useRouter();
  const { registerExtern } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [professionData, setProfessionData] = useState<TProfession[]>([]);
  const [contentData, setContentData] = useState<TProfession[]>([]);

  const [gettinProfesion, setGettinProfession] = useState<boolean>(false);
  const [gettingContent, setGettinContent] = useState<boolean>(false);

  useEffect(() => {
    getProfession();
    getContent();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
    getValues,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      content: "",
      company: "",
      password: "",
      confirmPassword: "",
      profession: "",
    },
  });

  const handleOptionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(event.target.value);
    setValue("content", event.target.value);
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

  const getContent = async () => {
    setGettinContent(true);
    try {
      const res = await axios.get(apiUrls.extentTypes.getAll);
      console.log("tipo de contenido", res.data.data);
      setContentData(res.data.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("error: ", error.response?.data);
      }
      toast.error("No los tipos de contenido");
    }
  };

  useEffect(() => {
    console.log("errores", errors);
  }, [errors]);
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      console.log(data);
      const res = await axios.post(apiUrls.auth.externUser, {
        full_name: data.name,
        profession_id: data.profession,
        email: data.email,
        work_for_company: data.company,
        password: data.password,
        extern_type_id: data.content,
      });

      const { access_token, user } = res.data;
      const userInfo = {
        id: user.id,
        name: user.full_name,
        email: user.email,
        type: user.type,
        adviser_id: user.adviser_id || null,
        logo: user.company?.logo || null,
        company_id: user.company?.id,
        extern_type: [],
      };
      registerExtern(access_token, userInfo);
      if (
        user.type !== "admin" &&
        user.type !== "company_owner" &&
        user.type !== "extern"
      ) {
        toast.warning("No tienes permisos para acceder");
        return;
      }
      toast.success("Registro exitoso");
      router.push(user.type === "extern" ? "/publicador" : "/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message);
      } else toast.error("Error al registrar");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mainBg ">
      <div className="flex justify-center items-center overflow-auto min-h-screen p-8 lg:p-16 max-w-[1200px] mx-auto flex-col md:flex-row gap-8 md:gap-2 ">
        <div className="flex md:flex-1 flex-col md:items-start gap-4">
          <div className="bg-[#023719] rounded-lg px-5 py-3 flex-1">
            <Image
              priority
              className=" h-full w-full object-contain"
              src={"/img/logoh.png"}
              width={177}
              height={71}
              alt="Logo de PevPeru en Horizontal"
            />
          </div>
          <span className="text-white text-lg">Portal de administrador</span>

          <p className="hidden md:block border-l-2 border-white pl-4 text-white text-xl">
            Centro de <br /> información agrícola
          </p>
        </div>
        <div
          className="bg-white 
    flex items-start md:flex-1 rounded-xl p-8 md:p-14 flex-col"
        >
          <h1 className="text-3xl font-bold text-zinc-600 mb-8">Registrarse</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="w-full ">
            <div className="flex flex-col gap-4 md:max-h-[50vh] md:overflow-y-auto pr-1">
              <InputZodField
                id="name"
                name="Nombre completo"
                placeholder="Juan Perez"
                register={register("name")}
                error={errors.name}
              />
              <InputZodField
                id="company"
                name="Nombre de la empresa"
                placeholder="Pev Peru"
                register={register("company")}
                error={errors.company}
              />
              <SelectZodField
                options={professionData}
                placeholder="Seleccione una profesión"
                id="profession"
                name="profession"
                register={register("profession")}
                error={errors.profession}
                getOptionValue={(item) => item.id.toString()}
                getOptionLabel={(item) => item.name}
              />
              <InputZodField
                id="email"
                name="Correo electrónico"
                type="email"
                placeholder="example@gmail.com"
                register={register("email")}
                error={errors.email}
              />
              <InputZodField
                id="password"
                name="Contraseña"
                type="password"
                isPassword
                placeholder="contraseña"
                register={register("password")}
                error={errors.password}
              />
              <InputZodField
                id="confirmPassword"
                name="Confirmar contraseña"
                isPassword
                type="password"
                placeholder="contraseña"
                register={register("confirmPassword")}
                error={errors.confirmPassword}
              />
              <div className="w-full">
                <h3 className="text-green-800 text-base font-medium ">
                  Tipo de contenido
                </h3>
                <div className="flex items-center justify-between mt-2">
                  {contentData.length > 0 &&
                    contentData.map((item, index) => (
                      <label
                        key={index}
                        htmlFor={item.id.toString()}
                        className="text-stone-600 font-regular text-sm flex"
                      >
                        <input
                          id={item.id.toString()}
                          className="hidden"
                          type="radio"
                          value={item.id}
                          checked={watch("content") === item.id.toString()}
                          onChange={handleOptionChange}
                        />
                        <span
                          className={`w-5 h-5 mr-2 rounded-full border-2 ${
                            watch("content") === item.id.toString()
                              ? "bg-green-800 border-green-800"
                              : "bg-white border-gray-300"
                          }  flex items-center justify-center text-center transform transition-all duration-700`}
                        >
                          {watch("content") === item.id.toString() && (
                            <span className="w-3 h-3 text-center bg-white rounded-full" />
                          )}
                        </span>
                        {item.name}
                      </label>
                    ))}
                </div>

                {errors.content && (
                  <p style={{ color: "red" }}>{errors.content.message}</p>
                )}
              </div>
              {/* 
            <InputField
            name="Contraseña"
            type="password"
            placeholder="Password"
            value={password}
            id="password"
            isPassword
            onChange={(e) => setPassword(e.target.value)}
            /> */}
            </div>
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="my-4 rounded-full w-full bg-lime-400 text-green-900 p-3 font-medium"
            >
              {loading ? "Cargando..." : "Registrarse"}
            </button>
            <div className="flex flex-col gap-2 items-center">
              <Link href={"/"} className="text-stone-500 font-[500]">
                Iniciar sesión
              </Link>
              {/* <Link
                href={"/forgot-my-password"}
                className="text-stone-500 font-[500]"
              >
                Iniciar sesión
              </Link> */}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Content;
