import { Metadata } from "next";
import Content from "./content";


export const metadata: Metadata = {
  title: "Archivos",
  description: "Archivos de los productos registrados",
};

function Page() {
  return <Content />;
}
export default Page;
