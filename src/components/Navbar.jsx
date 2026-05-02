import { Menu } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md">

      <div className="px-4 py-3 flex items-center justify-between">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">

          {/* HAMBURGER */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="md:hidden p-2 rounded hover:bg-blue-700 active:scale-95 transition"
          >
            <Menu size={22} />
          </button>

          {/* TITLE */}
          <div className="leading-tight">
            <h1 className="font-bold text-lg">
              Inventory Lapas Kelas IIA Samarinda
            </h1>
            <p className="text-xs opacity-80 hidden sm:block">
              Sistem Peminjaman Barang
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="text-right">
          <p className="font-medium text-sm">Admin</p>
          <p className="text-xs opacity-80 hidden sm:block">
            Panel Pengelola
          </p>
        </div>

      </div>
    </header>
  );
}