import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Usuarios",
  description: "Usuarios registrados",
};

function Page() {
  return <Content />;
}
export default Page;
