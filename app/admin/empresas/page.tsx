import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Empresas",
  description: "Empresas registradas",
};

function Page() {
  return <Content />;
}
export default Page;
