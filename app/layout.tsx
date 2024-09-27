import type { Metadata } from "next";
import "./globals.css";

import localFont from "next/font/local";

const roboto = localFont({
  src: [
    {
      path: "./assets/fonts/poppins/Poppins-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./assets/fonts/poppins/Poppins-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./assets/fonts/poppins/Poppins-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "./assets/fonts/poppins/Poppins-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "./assets/fonts/poppins/Poppins-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./assets/fonts/poppins/Poppins-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

import AuthContextProvider from "@/app/context/authContext";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "Admin - PevPeru",
    template: "%s - PevPeru",
  },
  description: "Admin - PevPeru",
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
          {children}
          <Toaster
            expand={false}
            position="bottom-right"
            richColors
            closeButton
          />
        </AuthContextProvider>
      </body>
    </html>
  );
}
