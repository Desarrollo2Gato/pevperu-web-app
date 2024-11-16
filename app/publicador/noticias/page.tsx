import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Noticias registradas",
};

function Page() {
  return <Content />;
}
export default Page;
