import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Planes",
  description: "Planes de los productos",
};

function Page() {
  return <Content />;
}
export default Page;
