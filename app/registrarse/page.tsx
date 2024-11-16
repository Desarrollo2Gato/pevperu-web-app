import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Registro",
  description:
    "Registrate ahora y sube contenido como noticias, eventos y cursos",
};

function Page() {
  return <Content />;
}
export default Page;
