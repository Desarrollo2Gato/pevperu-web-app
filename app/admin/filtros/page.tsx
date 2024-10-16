import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Filtros",
  description: "Filtros para los productos y categorías",
};

function Page() {
  return <Content />;
}
export default Page;
