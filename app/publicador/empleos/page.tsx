import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Empleos",
  description: "Empleos",
};

function Page() {
  return <Content />;
}
export default Page;
