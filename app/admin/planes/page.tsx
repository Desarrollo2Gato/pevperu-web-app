import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Planes",
  description: "Planes para empresas proveedores",
};

function Page() {
  return <Content />;
}
export default Page;
