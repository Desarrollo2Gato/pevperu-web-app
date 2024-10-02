"use client";
import ButtonForm from "@/components/ui/buttonForm";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/components/ui/containers";
import { InputZodField } from "@/components/ui/inputField";
import { useAuthContext } from "@/context/authContext";
import { IHelpCompany } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import { ChangePasswordSchema } from "@/utils/shcemas/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Content = () => {
  const { user } = useAuthContext();
  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token.toString());
    }
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirm: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    if (!user) {
      toast.error("Usuario no encontrado");
      return;
    }

    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(
          apiUrls.user.password(user?.company_id.toString()),
          {
            current_password: data.currentPassword,
            new_password: data.password,
            new_password_confirmation: data.passwordConfirm,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        reset();
        resolve({ message: "contraseña actualizada" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al actualizar contraseña" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Actualizando contraseña...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

  return (
    <SafeAreaContainer isPassword>
      <MainContainer title="Actualizar Contraseña">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-4 mt-2 flex flex-col"
        >
          <InputZodField
            id="currentPassword"
            name="Contraseña Actual"
            register={register("currentPassword")}
            error={errors.currentPassword}
            isPassword
            type="password"
          />
          <InputZodField
            id="password"
            name="Nueva contraseña"
            register={register("password")}
            error={errors.password}
            isPassword
            type="password"
          />
          <InputZodField
            id="passwordConfirm"
            name="Confirmar contraseña"
            register={register("passwordConfirm")}
            error={errors.passwordConfirm}
            isPassword
            type="password"
          />
          <div className="flex justify-end">
            <ButtonForm
              text="Guardar"
              onClick={handleSubmit(onSubmit)}
              primary
              isdisabled={loading}
            />
          </div>
        </form>
      </MainContainer>
    </SafeAreaContainer>
  );
};

export default Content;
