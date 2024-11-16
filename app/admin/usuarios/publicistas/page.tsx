import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Publicistas",
  description: "Publicistas registrados",
};

function Page() {
  return <Content />;
}
export default Page;
