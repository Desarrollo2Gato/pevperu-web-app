import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Cursos",
  description: "Cursos para la app",
};

function Page() {
  return <Content />;
}
export default Page;
