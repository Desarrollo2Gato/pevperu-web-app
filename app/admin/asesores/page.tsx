import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Asesores",
  description: "Asesores",
};

function Page() {
  return <Content />;
}
export default Page;
