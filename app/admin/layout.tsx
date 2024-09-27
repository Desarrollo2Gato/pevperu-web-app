"use client";
import { useState } from "react";
import Sidebar from "../components/navigation/sidebar";
import Header from "../components/navigation/header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [siderActive, setSiderActive] = useState(false);
  const handleSidebar = () => {
    setSiderActive(!siderActive);
  };
  return (
    <div className="h-screen w-full bg-gray-100">
      {/* sidebar */}
      <Sidebar active={siderActive} setActive={setSiderActive} />
      <Header handleSidebar={handleSidebar} active={siderActive} />
      <main
        className={`${
          siderActive
            ? "left-[250px] w-[calc(100%-250px)]"
            : "left-[70px] w-[calc(100%-70px)]"
        } bg-gray-100 relative top-[70px] transform transition-all duration-700 overflow-auto p-8 `}
      >
        {children}
      </main>

    </div>
  );
}
