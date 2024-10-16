import { Metadata } from "next";
import ContentAdmin from "./content";

export const metadata: Metadata = {
  title: "Inicio",
  description: "Inicio para usuario empresa",
};

function Page() {
  return <ContentAdmin />;
}
export default Page;
