import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Eventos",
  description: "Eventos registrados",
};

function Page() {
  return <Content />;
}
export default Page;
