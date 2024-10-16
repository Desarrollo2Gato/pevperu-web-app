import { Metadata } from "next";
import Content from "./content";

export const metadata: Metadata = {
  title: "Olvidé mi contraseña",
  description: "Recupera tu contraseña",
};

const ForgotMyPasswordPage = () => {
  return <Content />;
};

export default ForgotMyPasswordPage;
