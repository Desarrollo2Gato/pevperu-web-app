import { FaRegCalendarAlt } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
import { FaRegNewspaper } from "react-icons/fa";
import { useNotifications } from "@/context/notificationContext";
import { useEffect, useState } from "react";
import { LuUserCheck } from "react-icons/lu";
import Link from "next/link";

const Notifications = () => {
  const { notifications } = useNotifications();
  return (
    <div className="w-fulf overflow-hidden">
      <div className="p-4 ">
        <h1 className="text text-zinc-500 font-medium">Notificaciones</h1>
        <div className="flex flex-col gap-2 mt-4 overflow-auto max-h-[280px] pr-1">
          {notifications.map((notifications) => (
            <NotificationCard
              message={notifications.message}
              type={notifications.type}
              status={notifications.status}
              onPress={() => console.log("Pressed")}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default Notifications;

type NotificationCardProps = {
  message: string;
  type: string;
  status: string;
  onPress: () => void;
};

const NotificationCard: React.FC<NotificationCardProps> = ({
  message,
  type = "Event",
  status = "unread",
  onPress,
}) => {
  const [title, setTitle] = useState<string>("");

  useEffect(() => {
    switch (type) {
      case "Event":
        setTitle("Evento");
        break;
      case "Product":
        setTitle("Producto");
        break;
      case "News":
        setTitle("Noticia");
        break;
      case "Subs":
        setTitle("Suscripción");
        break;
      default:
        setTitle("Notificación");
        break;
    }
  }, [type]);

  return (
    <div className="flex flex-row gap-2 items-center bg-gray-100 p-2 rounded-md">
      <div className="bg-white rounded-[100%] p-1 aspect-square h-9 w-9 justify-center items-center flex">
        {title === "Evento" && <FaRegCalendarAlt className="text-green-800 text-xl" />}
        {title === "Producto" && <LuBoxes className="text-green-800 text-xl" />}
        {title === "Noticia" && <FaRegNewspaper className="text-green-800 text-xl" />}
        {title === "Suscripción" && <LuUserCheck className="text-green-800 text-xl" />}
      </div>
      <div className="flex flex-col w-full">
        <span className="text-zinc-500 font-medium text-sm">{title}</span>
        <span className="text-xs text-zinc-500">{message}</span>
      </div>
      <div
        className={`w-2 h-2 aspect-square ${
          status === "unread" ? "bg-lime-500" : "bg-gray-400"
        }  rounded-[100%]`}
      ></div>
    </div>
  );
};
