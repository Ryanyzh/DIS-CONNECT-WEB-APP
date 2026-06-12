import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div
      className={
        darkMode
          ? "min-h-screen bg-wise-ink text-wise-canvas font-sans"
          : "min-h-screen bg-wise-canvas text-wise-ink font-sans"
      }
    >
      <div className="flex h-screen flex-row">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />
          <main className="flex-1 overflow-auto">
            <div className="mr-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
