import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Productos",
  description: "Productos registrados",
};

function Page() {
  return <Content />;
}
export default Page;
