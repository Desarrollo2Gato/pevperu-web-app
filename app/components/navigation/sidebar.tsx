"use client";

import Image from "next/image";

import { HiOutlineHome } from "react-icons/hi";
import { PiCards } from "react-icons/pi";
import { RiCustomerService2Line } from "react-icons/ri";
import { MdOutlineAutoAwesomeMosaic } from "react-icons/md";
import { MdEventNote } from "react-icons/md";
import { IoNewspaperOutline } from "react-icons/io5";
import { GrBook } from "react-icons/gr";
import { LuLogOut } from "react-icons/lu";
import { LuBoxes } from "react-icons/lu";
import { TbDeviceIpadDollar } from "react-icons/tb";
import { apiUrls } from "@/app/utils/api/apiUrls";
import axios from "axios";
import { useAuthContext } from "@/app/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa6";

interface SidebarProps {
  active: boolean;
  setActive: (active: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuthContext();

  const handleMenuClick = (menu: string) => {
    router.push(`/admin/${menu}`);
  };

  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        apiUrls.auth.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.status !== 200) {
        alert("Error al cerrar sesión");
        return;
      }

      logout();
    } catch (error) {
      console.log("Error al cerrar sesión", error);
    }
  };

  return (
    <div
      className={`${
        active ? "w-[250px]" : "w-[70px]"
      } fixed h-screen bg-gradient-to-b from-[#0f502b] via-[#072514] to-[#05130b]  flex flex-col items-center top-0 left-0 z-10 transform transition-all duration-700 pr-[2px]`}
    >
      {" "}
      {/* sideber */}
      <div
        className={`w-50 h-50 bg-[#023719] my-4 rounded-[100%] shadow aspect-square ${
          active ? "p-4" : "p-2 ml-2 mr-[8px]"
        }  role="button`}
        onClick={() => handleMenuClick("/")}
      >
        <Image
          className="w-full h-full object-contain "
          src={"/img/logo.png"}
          alt="Logo PevPeru"
          height={60}
          width={60}
        />
      </div>
      <nav className="nav-container w-full h-full pr-[8px]">
        <ul className="nav-items flex flex-col text-white text-2xl visible">
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("/")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <HiOutlineHome className="" />
              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Inicio
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Inicio
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("suscripciones")}
              className={` overflow-hidden flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/suscripciones"
                  ? "opacity-100"
                  : " opacity-30"
              } transition-all duration-500`}
            >
              <TbDeviceIpadDollar />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Suscripciones
              </span>
             
            </button>
            {!active && (
                <div className="opacity-0  group-hover:opacity-100 hidden group-hover:block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-900 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap">
                  Suscripciones
                </div>
              )}
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("planes")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/planes" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <PiCards />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Planes
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Planes
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("categorias")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/categorias" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <MdOutlineAutoAwesomeMosaic />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Categorías
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Categorías
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("productos")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/productos" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <LuBoxes />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Productos
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Productos
                </div>
              )}
            </button>
          </li>

          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("eventos")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/eventos" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <MdEventNote />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Eventos
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Eventos
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("noticias")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/noticias" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <IoNewspaperOutline />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Noticias
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Noticias
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("cursos")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/cursos" ? "opacity-100" : " opacity-30"
              } transition-all duration-500`}
            >
              <GrBook />
              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Cursos
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Cursos
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("atencion-cliente")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/atencion-cliente"
                  ? "opacity-100"
                  : " opacity-30"
              } transition-all duration-500`}
            >
              <RiCustomerService2Line />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Atención al cliente
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Atención al cliente
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={() => handleMenuClick("usuarios")}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  hover:opacity-100 ${
                pathname === "/admin/usuarios"
                  ? "opacity-100"
                  : " opacity-30"
              } transition-all duration-500`}
            >
             <FaUsers />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Usuarios
              </span>
              {!active && (
                <div className="opacity-0 group-hover:opacity-100 block px-3 py-1 text-xs bg-[#000] text-zinc-50 fixed rounded right-0 translate-x-[calc(100%+16px)]  transition-all transform duration-600 group-hover:translate-x-[calc(100%-2px)] tooltip shadow whitespace-nowrap z-10">
                  Usuarios
                </div>
              )}
            </button>
          </li>
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-8" : "pr-[9px] pl-4 "
            } `}
          >
            <button
              onClick={handleLogOut}
              className={` flex flex-row items-center relative ${
                !active && "justify-center"
              } w-full  text-lime-400 transition-all duration-500`}
            >
              <LuLogOut />

              <span
                className={`${
                  !active && "hidden"
                } ml-2 text-base inline-block transform transition-all duration-700`}
              >
                Cerrar Sesión
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Sidebar;
