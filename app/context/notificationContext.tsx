"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { apiUrls } from "../utils/api/apiUrls";
import { INotification } from "../types/api";
import { useAuthContext } from "./authContext";
import { getTokenFromCookie } from "../utils/api/getToken";

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  fetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const { user } = useAuthContext();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getTokenFromCookie();
    if (token) {
      setToken(token);
    }
  }, []);

  // Función para obtener notificaciones desde el servidor
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(apiUrls.notifications.get, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotifications(response.data.notifications);
      const unreadCount = response.data.notifications.filter(
        (n: any) => n.status === "unread"
      ).length;

      if (unreadCount > 99) {
        setUnreadCount(99);
      } else {
        setUnreadCount(unreadCount);
      }
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  // Función para escuchar mensajes del WebSocket
  const handleWebSocketMessage = (event: MessageEvent) => {
    const message = JSON.parse(event.data);
    console.log("Mensaje recibido del WebSocket: ", message);

    if (message.event === "new-notification") {
      // Actualizar la lista de notificaciones con la nueva notificación
      setNotifications((prevNotifications) => [
        ...prevNotifications,
        message.data,
      ]);

      // Actualizar el contador de notificaciones no leídas
      setUnreadCount((prevCount) => Math.min(prevCount + 1, 99));
    }
  };

  useEffect(() => {
    if (token) {
      fetchNotifications(); 

      const ws = new WebSocket(
        `wss://pevperu-server.jocargames.com/app/txizrczlrzunccto1s1w`
      );
      setWebSocket(ws);

      ws.onopen = () => {
        // console.log("Conectado al WebSocket");

        const subscribeMessage = {
          event: "pusher:subscribe",
          data: {
            auth: token,
            channel: `bNgtl3bXdMeRNdCUSb4Z3g==`,
          },
        };
        ws.send(JSON.stringify(subscribeMessage));
      };

      ws.onmessage = handleWebSocketMessage;

      ws.onerror = (error) => {
        console.log("Error en WebSocket: ", error);
      };

      ws.onclose = () => {
        console.log("WebSocket desconectado");
      };

      return () => {
        ws.close();
        setWebSocket(null);
      };
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, fetchNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook para usar el contexto de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};
