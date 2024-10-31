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
import { apiUrls } from "@/utils/api/apiUrls";
import axios from "axios";
import { useAuthContext } from "@/context/authContext";
import { usePathname, useRouter } from "next/navigation";
import { FaUsers } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { getTokenFromCookie } from "@/utils/api/getToken";
import Link from "next/link";
import { BootstrapTooltip } from "../ui/tooltip";
import { TbLockCog } from "react-icons/tb";
import { LuFilter } from "react-icons/lu";
import { PiFilesBold } from "react-icons/pi";
import { FaRegBuilding } from "react-icons/fa";
import { toast } from "sonner";
import { MdOutlineCampaign } from "react-icons/md";

interface SidebarProps {
  active: boolean;
  setActive: (active: boolean) => void;
}
const Sidebar: React.FC<SidebarProps> = ({ active, setActive }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, user } = useAuthContext();

  // token
  const [token, setToken] = useState("");

  useEffect(() => {
    //obtener token
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  const handleLogOut = async () => {
    try {
      const res = await axios.post(
        apiUrls.auth.logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status !== 200) {
        alert("Error al cerrar sesión");
        return;
      }
    } catch (error) {
      toast.error("Error al cerrar sesión");
    } finally {
      logout();

      router.push("/");
    }
  };

  return (
    <div
      className={`${
        active ? " w-[70px] md:w-[250px]" : "w-0 md:w-[70px]"
      } fixed h-screen bg-gradient-to-b px-[1px] from-[#0f502b] via-[#072514] to-[#05130b]  flex flex-col items-center top-0 left-0 z-10 transform transition-all duration-700 `}
    >
      {" "}
      {/* sideber */}
      <Link
        className={`w-[50px] h-[50px] bg-[#023719] my-4 rounded-[100%] shadow aspect-square p-2 transform transition-all duration-700 `}
        href={"/"}
      >
        <Image
          className="w-full h-full object-contain "
          src={"/img/logo.png"}
          alt="Logo PevPeru"
          height={60}
          width={60}
        />
      </Link>
      <nav className="w-full h-full overflow-y-auto">
        <ul className="flex flex-col text-white text-2xl  ">
          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-4 md:px-8" : "px-4 "
            } `}
          >
            <BootstrapTooltip placement="right" title={active ? "" : "Inicio"}>
              <Link
                href={"/"}
                className={`flex flex-row items-center relative ${
                  !active ? "justify-center" : "justify-center md:justify-start"
                } w-full  hover:opacity-100 ${
                  pathname === "/admin" || pathname === "/empresa"
                    ? "opacity-100"
                    : " opacity-30"
                } transition-all duration-500`}
              >
                <HiOutlineHome className="text-2xl" />
                <span
                  className={`${
                    !active ? "hidden" : "hidden md:inline-block"
                  } ml-2 text-base inline-block transform transition-all duration-700`}
                >
                  Inicio
                </span>
              </Link>
            </BootstrapTooltip>
          </li>
          {user?.type === "company_owner" && (
            <>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Productos"}
                >
                  <Link
                    href={"/empresa/productos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100  ${
                      pathname === "/empresa/productos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <LuBoxes className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Productos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Eventos"}
                >
                  <Link
                    href={"/empresa/eventos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/empresa/eventos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <MdEventNote className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Eventos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Noticias"}
                >
                  <Link
                    href={"/empresa/noticias"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/empresa/noticias"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <IoNewspaperOutline className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Noticias
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              {
                user?.plan?.id !== 1 && (
                  <li
                  className={`w-full justify-center flex items-center py-4 group ${
                    active ? "px-4 md:px-8" : "px-4 "
                  } `}
                >
                  <BootstrapTooltip
                    placement="right"
                    title={active ? "" : "Publicidad"}
                  >
                    <Link
                      href={"/empresa/publicidad"}
                      className={`flex flex-row items-center relative ${
                        !active
                          ? "justify-center"
                          : "justify-center md:justify-start"
                      } w-full  hover:opacity-100 ${
                        pathname === "/empresa/publicidad" ||
                        pathname === "/empresa/publicidad"
                          ? "opacity-100"
                          : " opacity-30"
                      } transition-all duration-500`}
                    >
                      <MdOutlineCampaign className="text-2xl" />
                      <span
                        className={`${
                          !active ? "hidden" : "hidden md:inline-block"
                        } ml-2 text-base inline-block transform transition-all duration-700`}
                      >
                        Publicidad
                      </span>
                    </Link>
                  </BootstrapTooltip>
                </li>
                )
              }
             
            </>
          )}

          {user?.type === "admin" && (
            <>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Suscripciones"}
                >
                  <Link
                    href={"/admin/suscripciones"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/suscripciones"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <TbDeviceIpadDollar className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Suscripciones
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Planes"}
                >
                  <Link
                    href={"/admin/planes"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/planes"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <PiCards className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Planes
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Filtros"}
                >
                  <Link
                    href={"/admin/filtros"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/filtros"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <LuFilter className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Filtros
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Categorías"}
                >
                  <Link
                    href={"/admin/categorias"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/categorias"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <MdOutlineAutoAwesomeMosaic className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Categorías
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Productos"}
                >
                  <Link
                    href={"/admin/productos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/productos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <LuBoxes className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Productos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>

              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Eventos"}
                >
                  <Link
                    href={"/admin/eventos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/eventos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <MdEventNote className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Eventos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Noticias"}
                >
                  <Link
                    href={"/admin/noticias"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/noticias"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <IoNewspaperOutline className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Noticias
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Cursos"}
                >
                  <Link
                    href={"/admin/cursos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/cursos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <GrBook className="text-2xl" />
                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Cursos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Empresas"}
                >
                  <Link
                    href={"/admin/empresas"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/empresas"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <FaRegBuilding className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Empresas
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Usuarios"}
                >
                  <Link
                    href={"/admin/usuarios"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/usuarios"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <FaUsers className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Usuarios
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Archivos"}
                >
                  <Link
                    href={"/admin/archivos"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/archivos"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <PiFilesBold className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Archivos
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Publicidad"}
                >
                  <Link
                    href={"/admin/publicidad"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/publicidad" ||
                      pathname === "/empresa/publicidad"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <MdOutlineCampaign className="text-2xl" />
                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Publicidad
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
              <li
                className={`w-full justify-center flex items-center py-4 group ${
                  active ? "px-4 md:px-8" : "px-4 "
                } `}
              >
                <BootstrapTooltip
                  placement="right"
                  title={active ? "" : "Atención al cliente"}
                >
                  <Link
                    href={"/admin/atencion-cliente"}
                    className={`flex flex-row items-center relative ${
                      !active
                        ? "justify-center"
                        : "justify-center md:justify-start"
                    } w-full  hover:opacity-100 ${
                      pathname === "/admin/atencion-cliente"
                        ? "opacity-100"
                        : " opacity-30"
                    } transition-all duration-500`}
                  >
                    <RiCustomerService2Line className="text-2xl" />

                    <span
                      className={`${
                        !active ? "hidden" : "hidden md:inline-block"
                      } ml-2 text-base inline-block transform transition-all duration-700`}
                    >
                      Atención al cliente
                    </span>
                  </Link>
                </BootstrapTooltip>
              </li>
            </>
          )}

          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-4 md:px-8" : "px-4 "
            } `}
          >
            <BootstrapTooltip
              placement="right"
              title={active ? "" : "Cambiar Contraseña"}
            >
              <Link
                href={
                  user?.type === "admin"
                    ? "/admin/contrasenia"
                    : "/empresa/contrasenia"
                }
                className={`flex flex-row items-center relative ${
                  !active ? "justify-center" : "justify-center md:justify-start"
                } w-full  hover:opacity-100 ${
                  pathname === "/admin/contrasenia" ||
                  pathname === "/empresa/contrasenia"
                    ? "opacity-100"
                    : " opacity-30"
                } transition-all duration-500`}
              >
                <TbLockCog className="text-2xl" />
                <span
                  className={`${
                    !active ? "hidden" : "hidden md:inline-block"
                  } ml-2 text-base inline-block transform transition-all duration-700`}
                >
                  Contraseña
                </span>
              </Link>
            </BootstrapTooltip>
          </li>

          <li
            className={`w-full justify-center flex items-center py-4 group ${
              active ? "px-4 md:px-8" : "px-4 "
            } `}
          >
            <button
              onClick={handleLogOut}
              className={`flex flex-row items-center relative ${
                !active ? "justify-center" : "justify-center md:justify-start"
              } w-full  text-lime-400 transition-all duration-500 `}
            >
              <LuLogOut className="text-2xl" />

              <span
                className={`${
                  !active ? "hidden" : "hidden md:inline-block"
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
