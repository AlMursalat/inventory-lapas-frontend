import { Link } from "react-router-dom";
import { X } from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0
          h-full w-64 bg-gray-800 text-white
          p-4 space-y-3 z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:block
        `}
      >
        {/* HEADER MOBILE */}
        <div className="flex justify-between items-center mb-6 md:hidden">
          <h2 className="font-bold text-lg">Menu</h2>

          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="space-y-2">

          <Link
            to="/"
            onClick={toggleSidebar}
            className="block hover:bg-gray-700 p-2 rounded transition"
          >
            Dashboard
          </Link>

          <Link
            to="/products"
            onClick={toggleSidebar}
            className="block hover:bg-gray-700 p-2 rounded transition"
          >
            Barang
          </Link>

          <Link
            to="/borrowers"
            onClick={toggleSidebar}
            className="block hover:bg-gray-700 p-2 rounded transition"
          >
            Peminjam
          </Link>

          <Link
            to="/borrowings"
            onClick={toggleSidebar}
            className="block hover:bg-gray-700 p-2 rounded transition"
          >
            Manajemen Peminjaman
          </Link>

        </nav>
      </div>
    </>
  );
}