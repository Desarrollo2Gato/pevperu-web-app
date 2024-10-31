import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Publicidad",
  description: "Publicidad de la empresa",
};

function Page() {
  return <Content />;
}
export default Page;
