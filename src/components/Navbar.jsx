import { Menu, User } from "lucide-react";

export default function Navbar({ toggleSidebar }) {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">

      <div className="px-4 md:px-6 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* HAMBURGER */}
          <button
            onClick={toggleSidebar}
            aria-label="Toggle Sidebar"
            className="
              md:hidden
              p-2 rounded-xl
              hover:bg-gray-100
              transition
            "
          >
            <Menu size={22} className="text-gray-700" />
          </button>

          {/* LOGO + TITLE */}
          <div className="flex items-center gap-3">

            {/* LOGO IMAGE */}
            <div
              className="
                w-11 h-11 rounded-2xl
                bg-white
                flex items-center justify-center
                shadow-md border border-gray-200
                overflow-hidden
              "
            >
              <img
                src="/logo_siperang.png"
                alt="Logo SIPERANG"
                className="w-9 h-9 object-contain"
              />
            </div>

            {/* TITLE */}
            <div className="leading-tight">
              <h1 className="font-bold text-base md:text-lg text-gray-800 tracking-wide">
                SIPERANG
              </h1>

              <p className="text-xs md:text-sm text-gray-500">
                Sistem Peminjaman Barang
              </p>
            </div>

          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* ADMIN AVATAR */}
          <div
            className="
              w-10 h-10 rounded-full
              bg-gradient-to-br from-blue-600 to-blue-500
              flex items-center justify-center
              shadow-md
            "
          >
            <User
              size={18}
              className="text-white"
            />
          </div>

          {/* ADMIN INFO */}
          <div className="hidden sm:block leading-tight">
            <p className="font-semibold text-sm text-gray-800">
              Admin
            </p>

            <p className="text-xs text-gray-500">
              Panel Pengelola
            </p>
          </div>

        </div>

      </div>
    </header>
  );
}