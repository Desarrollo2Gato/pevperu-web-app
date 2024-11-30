import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Suscripciones",
  description: "Empresas suscritas",
};

function Page() {
  return <Content />;
}
export default Page;
