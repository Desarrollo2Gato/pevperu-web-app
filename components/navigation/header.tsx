import { useAuthContext } from "@/context/authContext";
import { imgUrl } from "@/utils/img/imgUrl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LuMoveRight } from "react-icons/lu";
import { LuBell } from "react-icons/lu";
import Notifications from "../ui/notifications";
import { useNotifications } from "@/context/notificationContext";

interface HeaderProps {
  handleSidebar: () => void;
  active: boolean;
}
const Header: React.FC<HeaderProps> = ({ handleSidebar, active }) => {
  const { user } = useAuthContext();
  const { unreadCount } = useNotifications();

  const pathname = usePathname();

  const nameView = pathname.split("/").pop()?.replace("-", " ");

  const name = user?.name?.split(" ")[0];

  const [showNotification, setShowNotification] = useState(false);

  const toggleNotification = () => {
    setShowNotification(!showNotification);
  };

  const handleClick = (e: MouseEvent) => {
    // Verifica si el target es un elemento
    const target = e.target as Element; // Aserción de tipo

    // Comprueba si el clic ocurrió fuera del contenedor de notificaciones
    if (target.closest(".notification-container")) return;
    setShowNotification(false);
  };

  return (
    <div
      className={`fixed z-10 top-0 h-[70px] shadow transform transition-all duration-700 bg-white flex justify-between items-center flex-row p-4  ${
        active
          ? "md:left-[250px] md:w-[calc(100%-250px)] left-[70px] w-[calc(100%-70px)]"
          : "md:left-[70px] md:w-[calc(100%-70px)] left-0 w-full"
      }`}
    >
      <div className="flex flex-row gap-4">
        <button onClick={handleSidebar}>
          {active ? (
            <LuMoveRight className="text-xl text-zinc-500  transform rotate-180 " />
          ) : (
            <HiOutlineMenuAlt1 className="text-2xl text-zinc-500 " />
          )}
        </button>
        <h1 className="capitalize text-xl text-zinc-500 font-medium">
          {nameView === "admin" || nameView === "company"
            ? "Inicio"
            : nameView === "contrasenia"
            ? "Contraseña"
            : nameView}
        </h1>
      </div>

      <div className="flex flex-row gap-4 ">
        <div className="relative">
          <button
            className="p-1 rounded-[100%] aspect-square w-9 h-9 transfomr transition-all duration-500 hover:bg-gray-100"
            onClick={toggleNotification}
            type="button"
          >
            <LuBell className="text-xl text-zinc-500 mx-auto block" />

            {unreadCount > 0 && (
              <span className="text-[10px] font-medium bg-red-500 rounded-full py-[3.5px] px-[6.5px]  min-w-[16px] text-white absolute top-0 right-0 leading-[9.5px] text-center">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotification && (
            <div className="absolute z-20 right-0 mt-[14px] w-80 md:w-[350px] bg-white shadow-lg rounded-b-md">
              <Notifications
                setShowNotification={() => setShowNotification(false)}
              />
            </div>
          )}
        </div>
        <div className="text-zinc-500 md:flex hidden flex-row gap-1 items-center">
          <span>{user?.type === "admin" ? "Administrador" : "Usuario"}</span> -
          <span>{name}</span>
          <Link href={"/"} className="ml-2">
            {user?.logo ? (
              <img
                src={imgUrl(user?.logo)}
                alt="user"
                className="w-9 h-9 aspect-square object-cover rounded-[100%]"
              />
            ) : (
              <HiOutlineUserCircle className="text-4xl text-lime-500" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
