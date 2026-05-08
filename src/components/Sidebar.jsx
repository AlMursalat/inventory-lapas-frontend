import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Package,
  Users,
  Repeat,
  LogOut,
} from "lucide-react";

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Barang",
      path: "/products",
      icon: <Package size={18} />,
    },
    {
      name: "Peminjam",
      path: "/borrowers",
      icon: <Users size={18} />,
    },
    {
      name: "Manajemen Peminjaman",
      path: "/borrowings",
      icon: <Repeat size={18} />,
    },
  ];

  return (
    <>
      {/* OVERLAY MOBILE */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0
          h-screen w-64
          bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900
          text-white
          z-50
          flex flex-col
          shadow-2xl
          border-r border-white/10
          transform transition-transform duration-300 ease-in-out
          overflow-y-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                SIPERANG
              </h1>

              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Sistem Peminjaman Barang
              </p>
            </div>

            {/* CLOSE MOBILE */}
            <button
              onClick={toggleSidebar}
              className="
                md:hidden
                p-2 rounded-lg
                hover:bg-white/10
                transition
              "
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-4 space-y-2">
          {menus.map((menu, index) => {
            const isActive = location.pathname === menu.path;

            return (
              <Link
                key={index}
                to={menu.path}
                onClick={toggleSidebar}
                className={`
                  group flex items-center gap-3
                  px-4 py-3 rounded-2xl
                  transition-all duration-300
                  font-medium
                  relative overflow-hidden
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/20"
                      : "hover:bg-white/10"
                  }
                `}
              >
                {/* ICON */}
                <div
                  className={`
                    transition-transform duration-300
                    ${!isActive && "group-hover:scale-110"}
                  `}
                >
                  {menu.icon}
                </div>

                {/* TEXT */}
                <span className="text-sm">
                  {menu.name}
                </span>

                {/* ACTIVE INDICATOR */}
                {isActive && (
                  <div className="absolute right-3 w-2 h-2 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="p-4 border-t border-white/10 bg-black/10 backdrop-blur-sm">
          <div className="mb-4 px-2">
            <p className="text-sm font-semibold text-white">
              Administrator
            </p>

            <p className="text-xs text-gray-400">
              Panel Pengelola SIPERANG
            </p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center justify-center gap-2
              bg-gradient-to-r from-red-500 to-red-600
              hover:from-red-600 hover:to-red-700
              transition-all duration-300
              py-3 rounded-2xl
              font-semibold
              shadow-lg shadow-red-500/20
              active:scale-95
            "
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}