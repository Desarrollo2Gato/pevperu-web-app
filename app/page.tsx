import { Metadata } from "next";
import Index from "./index";
export const metadata: Metadata = {
  title: "Iniciar sesión - Pev Perú",
  description: "Inicia sesión en tu cuenta para acceder a la plataforma",
};

export default function Home() {
  return <Index />;
}
