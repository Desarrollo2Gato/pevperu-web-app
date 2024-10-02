import { FaRegCalendarAlt } from "react-icons/fa";
import { LuBoxes } from "react-icons/lu";
import { FaRegNewspaper } from "react-icons/fa";
import { useNotifications } from "@/context/notificationContext";
import { useEffect, useState } from "react";
import { LuUserCheck } from "react-icons/lu";
import axios from "axios";
import { apiUrls } from "@/utils/api/apiUrls";
import { getTokenFromCookie } from "@/utils/api/getToken";
import { toast } from "sonner";
import { useAuthContext } from "@/context/authContext";
import { useRouter } from "next/navigation";

interface NotificationsProps {
  setShowNotification: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  setShowNotification,
}) => {
  const { notifications, fetchNotifications } = useNotifications();
  const [token, setToken] = useState<string | null>(null);
  const { user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token.toString());
    }
  }, []);

  const handleNoti = async (
    id: string,
    type: string,
    type_id: string,
    status: string
  ) => {
    if (status === "unread") {
      onRead(id);
    }
    if (user?.type === "admin") {
      switch (type) {
        case "Event":
          router.push(`/admin/eventos`);
          break;
        case "Product":
          router.push(`/admin/productos`);

          break;
        case "News":
          router.push(`/admin/noticias`);
          break;
        default:
          break;
      }
    } else{
      console.log("company_owner");
      switch (type) {
        case "Event":
          router.push(`/empresa/eventos`);
          break;
        case "Product":
          router.push(`/empresa/productos`);
          break;
        case "News":
          router.push(`/empresa/noticias`);
          break;
        default:
          break;
      }
    }
    setShowNotification();
  };

  const onRead = async (id: string) => {
    try {
      const res = await axios.post(
        apiUrls.notifications.read(id),
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchNotifications();
    } catch (error) {
      toast.error("Error al leer la notificación");
    }
  };

  return (
    <div className="w-fulf overflow-hidden">
      <div className="p-4 ">
        <h1 className="text text-zinc-500 font-medium">Notificaciones</h1>
        <div className="flex flex-col gap-2 mt-4 overflow-auto max-h-[280px] pr-1">
          {notifications.map((notifications, index) => (
            <NotificationCard
              key={index}
              message={notifications.message}
              type={notifications.type}
              status={notifications.status}
              onPress={() =>
                handleNoti(
                  notifications.id.toString(),
                  notifications.type,
                  notifications.id_item.toString(),
                  notifications.status
                )
              }
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
    <div
      role="button"
      onClick={onPress}
      className="flex flex-row gap-2 items-center bg-gray-100 p-2 rounded-md"
    >
      <div className="bg-white rounded-[100%] p-1 aspect-square h-9 w-9 justify-center items-center flex">
        {title === "Evento" && (
          <FaRegCalendarAlt className="text-green-800 text-xl" />
        )}
        {title === "Producto" && <LuBoxes className="text-green-800 text-xl" />}
        {title === "Noticia" && (
          <FaRegNewspaper className="text-green-800 text-xl" />
        )}
        {title === "Suscripción" && (
          <LuUserCheck className="text-green-800 text-xl" />
        )}
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
