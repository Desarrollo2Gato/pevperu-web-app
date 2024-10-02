"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiUrls } from "../../utils/api/apiUrls";
import { InputZodField } from "../../components/ui/inputField";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetPasswordSchema } from "../../utils/shcemas/Auth";
import Link from "next/link";

const Content = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(180);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      code: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      await axios.post(apiUrls.password.resetPassword, {
        email: data.email,
        token: data.code,
        password: data.password,
      });
      toast.success("Contraseña cambiada con éxito");
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Error al cambiar la contraseña");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="mainBg ">
      <div className="flex justify-center items-center overflow-auto min-h-screen p-8 lg:p-16 max-w-[1200px] mx-auto flex-col md:flex-row gap-8 md:gap-2 ">
        <div
          className="bg-white 
    flex items-start md:flex-1 rounded-xl p-8 md:p-14 flex-col max-w-[600px]"
        >
          <h1 className="text-3xl font-bold text-center w-full text-zinc-600 mb-4">
            Recuperar contraseña
          </h1>
          <p className=" text-zinc-600 mb-2 text-center">
            Ingrese el codigo que se le envió a su correo electrónico
          </p>

          <p className="w-full text-2xl text-red-600 mb-8 text-center ">
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </p>
          <form
            onSubmit={onSubmit}
            className="w-full flex flex-col gap-4 items-center"
          >
            <InputZodField
              name="Código"
              type="text"
              placeholder="1234"
              id="code"
              register={register("code")}
              error={errors?.code}
            />
            <InputZodField
              name="Correo electrónico"
              type="email"
              placeholder="example@gmail.com"
              id="email"
              register={register("email")}
              error={errors?.email}
            />
            <InputZodField
              name="Contraseña"
              type="password"
              placeholder="********"
              id="password"
              register={register("password")}
              isPassword
              error={errors?.password}
            />
            <InputZodField
              name="Confirmar contraseña"
              type="password"
              placeholder="********"
              id="passwordConfirm"
              isPassword
              register={register("passwordConfirm")}
              error={errors?.passwordConfirm}
            />
            <button
              type="submit"
              onClick={handleSubmit(onSubmit)}
              className="my-4 rounded-full w-full bg-lime-400 text-green-900 p-3 font-medium"
            >
              {loading ? "Cargando..." : "Enviar"}
            </button>
            <Link href={"/"} className="text-green-900 font-[500]">
              Iniciar sesión
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Content;
