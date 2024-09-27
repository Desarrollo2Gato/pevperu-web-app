import { useAuthContext } from "@/app/context/authContext";
import { imgUrl } from "@/app/utils/img/imgUrl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { HiOutlineUserCircle } from "react-icons/hi2";
import { LuMoveRight } from "react-icons/lu";
import { LuBell } from "react-icons/lu";

interface HeaderProps {
  handleSidebar: () => void;
  active: boolean;
}
const Header: React.FC<HeaderProps> = ({ handleSidebar, active }) => {
  const { user } = useAuthContext();

  const pathname = usePathname();

  // limpiar la url y obtener el nombre de la vista
  const nameView = pathname.split("/").pop()?.replace("-", " ");

  return (
    <div
      className={`fixed z-10 top-0 h-[70px] shadow transform transition-all duration-700 bg-white flex justify-between items-center flex-row p-4  ${
        active
          ? "left-[250px] w-[calc(100%-250px)]"
          : "left-[70px] w-[calc(100%-70px)]"
      }`}
    >
      <div className="flex flex-row gap-4">
        <button onClick={handleSidebar}>
          {active ? (
            <LuMoveRight className="text-xl text-zinc-500 " />
          ) : (
            <HiOutlineMenuAlt1 className="text-2xl text-zinc-500 " />
          )}
        </button>
        <h1 className="capitalize text-xl text-zinc-500 font-medium ">
          {nameView === "admin" ? "Inicio" : nameView}
        </h1>
      </div>

      <div className="flex flex-row gap-4">
        <button className="p-1 rounded-[100%] aspect-square w-9 h-9 transfomr transition-all duration-500 hover:bg-gray-100">
          <LuBell className="text-xl text-zinc-500 mx-auto block" />
        </button>
        <div className="text-zinc-500 flex flex-row gap-1 items-center">
          <span>Administrador</span> -
          <span>{user?.name ? user.name : "admin"}</span>
          <Link href={"/admin/perfil"} className="ml-2">
            {user?.logo ? (
              <img
                src={imgUrl(user?.logo)}
                alt="user"
                className="w-9 h-9 object-cover rounded-[100%]"
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
