"use client";
import { useRouter } from "next/navigation";
import { FormEvent,  useState } from "react";
import axios from "axios";
import { apiUrls } from "../utils/api/apiUrls";
import { InputField } from "../components/ui/inputField";
import { toast } from "sonner";
import Link from "next/link";

const Content = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiUrls.password.forgotPassword, {
        email: email,
      });

      if (res.status !== 200) {
        alert("Credenciales invalidas");
        return;
      }
      setEmail("");
      toast.success("Correo enviado con éxito");
      router.push("/reset-password");
    } catch (error) {
      console.error(error);
      toast.error("Error al enviar el correo");
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
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text text-zinc-600 mb-8 text-center">
            Recuerda que debe ser el correo electrónico asociado a tu cuenta
          </p>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col gap-4 items-center"
          >
            <InputField
              name="Correo electrónico"
              type="email"
              placeholder="example@gmail.com"
              value={email}
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              className="my-4 rounded-full w-full bg-lime-400 text-green-900 p-3 font-medium"
            >
              {loading ? "Cargando..." : "Enviar"}
            </button>
            <Link
              href={"/"}
              className="text-green-900 font-[500]"
            >
              Iniciar sesión
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Content;
