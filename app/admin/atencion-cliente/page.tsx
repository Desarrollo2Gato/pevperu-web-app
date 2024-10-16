import { Metadata } from "next";
import Content from "./content";
export const metadata: Metadata = {
  title: "Atencion al Cliente",
  description: "Formulario para atencion al cliente",
};
function Page() {
  return <Content />;
}
export default Page;
