import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Planes Independientes",
  description: "Planes para empresas independientes",
};

function Page() {
  return <Content />;
}
export default Page;
