"use client";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuthContext } from "./context/authContext";
import { apiUrls } from "./utils/api/apiUrls";
import axios from "axios";
import Image from "next/image";
import { InputField } from "./components/ui/inputField";
import Link from "next/link";

const Index = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuthContext();

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(apiUrls.auth.login, {
        email: email,
        password: password,
      });

      if (res.status !== 200) {
        alert("Credenciales invalidas");
        return;
      }

      const { access_token, user } = res.data;

      const userInfo = {
        name: user.full_name,
        email: user.email,
        type: user.type,
        logo: user.company?.logo || null,
        company_id: user.company?.id,
      };

      login(access_token, userInfo);
      console.log(user.type);

      if (user.type !== "admin" && user.type !== "company_owner") {
        alert("No tienes permisos para acceder a esta sección");
        return;
      }
      router.push(
        user.type === "admin"
          ? "/admin"
          : user.type === "company_owner"
          ? "/empresa"
          : "/"
      );
    } catch (error) {
      console.error(error);
      alert("Credenciales invalidas");
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
              className=" h-full w-full contain-content"
              src={"/img/logoh.png"}
              width={177}
              height={77}
              alt="Logo de PevPeru en Horizontal"
            />
          </div>
          <span className="text-white text-lg">Portal de administrador</span>

          <p className="hidden md:block border-l-2 border-white pl-4 text-white text-xl">
            Centro de <br /> informaciónagrícola
          </p>
        </div>
        <div
          className="bg-white 
    flex items-start md:flex-1 rounded-xl p-8 md:p-14 flex-col"
        >
          <h1 className="text-3xl font-bold text-zinc-600 mb-8">
            Iniciar sesión
          </h1>
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
            <InputField
              name="Contraseña"
              type="password"
              placeholder="Password"
              value={password}
              id="password"
              isPassword
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="submit"
              className="my-4 rounded-full w-full bg-lime-400 text-green-900 p-3 font-medium"
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
            <Link
              href={"/forgot-my-password"}
              className="text-green-900 font-[500]"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Index;
