import { Metadata } from "next";
import Content from "./content";


export const metadata: Metadata = {
  title: "Archivos",
  description: "Archivos de productos",

};


function Page() {
  return <Content />;
}
export default Page;
