import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const roboto = localFont({
  src: [
    {
      path: "../assets/fonts/poppins/Poppins-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/poppins/Poppins-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

import AuthContextProvider from "@/context/authContext";
import { Toaster } from "sonner";
import { NotificationProvider } from "../context/notificationContext";

export const metadata: Metadata = {
  title: {
    default: "Admin - Pev Perú",
    template: "%s - Pev Perú",
  },
  description: "Plataforma para administrar contenido de la app de Pev Perú",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.png" />
      </head>
      <body className={` ${roboto.className}`}>
        <AuthContextProvider>
          <NotificationProvider>
            {children}
            <Toaster
              expand={false}
              position="bottom-right"
              richColors
              closeButton
            />
          </NotificationProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
