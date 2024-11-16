import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Cultivos",
  description: "Cultivos para los asesores",
};

function Page() {
  return <Content />;
}
export default Page;
