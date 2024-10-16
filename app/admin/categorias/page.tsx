import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Categorías",
  description: "Categorías de los productos",
};

function Page() {
  return <Content />;
}
export default Page;
