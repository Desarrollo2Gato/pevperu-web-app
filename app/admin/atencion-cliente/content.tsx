"use client";
import ButtonForm from "@/components/ui/buttonForm";
import {
  MainContainer,
  SafeAreaContainer,
} from "@/components/ui/containers";
import { InputZodField } from "@/components/ui/inputField";
import { IHelpCompany } from "@/types/api";
import { apiUrls } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import { helpUpdateSchema } from "@/utils/shcemas/Admin";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
      link_web: "",
      link_admin_app: "",
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
        link_web: dataHelp.link_web || "",
        link_admin_app: dataHelp.link_admin_app || "",
      });
    }
  }, [dataHelp]);

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

  const onSubmit = async (data: any) => {
    setLoading(true);
    console.log(data);
    const promise = new Promise(async (resolve, reject) => {
      try {
        const res = await axios.put(
          apiUrls.help.update("1"),
          {
            whatsapp_link: data.ws_link,
            help_phone_number: data.phone,
            help_landline_number: data.telephone,
            help_email_contact: data.email,
            help_email_suscriptions: data.emailSuscription,
            help_email_courses: data.emailCourse,
            help_email_support: data.emailSupport,
            help_address: data.address,
            link_web: data.link_web,
            link_admin_app: data.link_admin_app,
            company_id: 1,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDataHelp(res.data);
        resolve({ message: "Cambios guardados" });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.log(error.response?.data);
        }
        reject({ message: "Error al guardar cambios" });
      } finally {
        setLoading(false);
      }
    });
    toast.promise(promise, {
      loading: "Guardando cambios...",
      success: (data: any) => `${data.message}`,
      error: (error: any) => `${error.message}`,
    });
  };

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
              min={9}
              max={9}
            />
            <InputZodField
              id="telephone"
              name="Número de teléfono"
              register={register("telephone")}
              error={errors.telephone}
              min={7}
              max={7}
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
        <MainContainer title="Enlaces">
          <div className="flex flex-col gap-4">
            <InputZodField
              id="link_web"
              name="Link de la web"
              placeholder="https://www.example.com"
              register={register("link_web")}
              error={errors.link_web}
            />
            <InputZodField
              id="link_admin_app"
              name="Link de la app (web admin)"
              placeholder="https://www.example.com"
              register={register("link_admin_app")}
              error={errors.link_admin_app}
            />
          </div>
        </MainContainer>
        <div className="flex justify-end">
          <ButtonForm
            text="Guardar"
            onClick={handleSubmit(onSubmit)}
            primary
            isdisabled={loading}
          />
        </div>
      </form>
    </SafeAreaContainer>
  );
};

export default Content;
