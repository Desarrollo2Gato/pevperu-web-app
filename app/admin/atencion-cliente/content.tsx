"use client";
import ButtonForm from "@/app/components/ui/buttonForm";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/app/components/ui/containers";
import { InputZodField } from "@/app/components/ui/inputField";
import { useAuthContext } from "@/app/context/authContext";
import { IHelpCompany } from "@/app/types/api";
import { apiUrls } from "@/app/utils/api/apiUrls";
import { getTokenFromCookie } from "@/app/utils/api/getToken";
import { helpUpdateSchema } from "@/app/utils/shcemas/Admin";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const Content = () => {
  const [token, setToken] = useState<string | null>(null);
  const [dataHelp, setDataHelp] = useState<IHelpCompany>();

  const [loading, setLoading] = useState(false);

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
  } = useForm({
    resolver: zodResolver(helpUpdateSchema),
    defaultValues: {
      ws_link: "",
      phone: "",
      telephone: "",
      email: "",
      emailSuscription: "",
      emailCourse: "",
      emailSupport: "",
      address: "",
    },
  });
  useEffect(() => {
    if (token) {
      getData();
    }
  }, [token]);

  useEffect(() => {
    if (dataHelp) {
      reset({
        ws_link: dataHelp.whatsapp_link || "",
        phone: dataHelp.help_phone_number || "",
        telephone: dataHelp.help_landline_number || "",
        email: dataHelp.help_email_contact || "",
        emailSuscription: dataHelp.help_email_suscriptions || "",
        emailCourse: dataHelp.help_email_courses || "",
        emailSupport: dataHelp.help_email_support || "",
        address: dataHelp.help_address || "",
      });
    }
  },[dataHelp]);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(apiUrls.help.getOne("1"), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDataHelp(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {};

  return (
    <SafeAreaContainer>
      <form onSubmit={handleSubmit(onSubmit)} className="gap-4 flex flex-col">
        <MainContainer title="Cantacto">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4 mb-4">
            <InputZodField
              id="phone"
              name="Número de celular"
              register={register("phone")}
              error={errors.phone}
            />
            <InputZodField
              id="telephone"
              name="Número de teléfono"
              register={register("telephone")}
              error={errors.telephone}
            />
            <InputZodField
              id="email"
              name="Correo de contacto"
              placeholder="email@example.com"
              type="email"
              register={register("email")}
              error={errors.email}
            />

            <InputZodField
              id="ws_link"
              name="LInk de whatsapp"
              register={register("ws_link")}
              error={errors.ws_link}
            />
          </div>
          <InputZodField
            id="address"
            name="Dirección"
            register={register("address")}
            error={errors.address}
          />
        </MainContainer>

        <MainContainer title="Emails">
          <div className="flex flex-col gap-4">
            <InputZodField
              id="emailSuscription"
              name="Correo de suscripciones"
              placeholder="subscriptions@gmail.com"
              type="email"
              register={register("emailSuscription")}
              error={errors.emailSuscription}
            />
            <InputZodField
              id="emailCourse"
              name="Correo de cursos"
              placeholder="courses@gmail.com"
              type="email"
              register={register("emailCourse")}
              error={errors.emailCourse}
            />
            <InputZodField
              id="emailSupport"
              name="Correo de soporte"
              placeholder="support@gmail.com"
              type="email"
              register={register("emailSupport")}
              error={errors.emailSupport}
            />
          </div>
        </MainContainer>
        <div className="flex justify-end">

        <ButtonForm text="Guardar" onClick={handleSubmit(onSubmit)} primary />
        </div>
      </form>
    </SafeAreaContainer>
  );
};

export default Content;
