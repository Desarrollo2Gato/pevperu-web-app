"use client";
import { useAuthContext } from "@/app/context/authContext";
import { useRouter } from "next/navigation";

const Content = () => {
  const { logout } = useAuthContext();
  const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-2">
      <h1>Contenido de perfil</h1>
    </div>
  );
}

export default Content;