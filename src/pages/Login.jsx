import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

import {
  ShieldCheck,
  User,
  LockKeyhole,
  LogIn,
} from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        min-h-screen
        flex items-center justify-center
        bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600
        p-4
      "
    >

      {/* CARD */}
      <div
        className="
          w-full max-w-md
          bg-white/95 backdrop-blur-md
          rounded-3xl shadow-2xl
          overflow-hidden
        "
      >

        {/* TOP SECTION */}
        <div
          className="
            bg-gradient-to-r from-blue-600 to-indigo-600
            px-8 py-10 text-white text-center
          "
        >

          {/* ICON */}
          <div className="flex justify-center mb-4">
            <div
              className="
                w-20 h-20 rounded-3xl
                bg-white/20 backdrop-blur-md
                flex items-center justify-center
                shadow-lg border border-white/20
              "
            >
              <ShieldCheck size={40} />
            </div>
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold tracking-wide">
            SIPERANG
          </h1>

          <p className="text-sm text-blue-100 mt-2">
            Sistem Peminjaman Barang
          </p>

        </div>

        {/* FORM */}
        <div className="p-8">

          <div className="mb-6 text-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Selamat Datang
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Silakan login untuk melanjutkan
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="space-y-5"
          >

            {/* USERNAME */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Username
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Masukkan username"
                  className="
                    w-full
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:bg-white
                    transition
                  "
                  value={form.username}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={18}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="password"
                  placeholder="Masukkan password"
                  className="
                    w-full
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                    focus:bg-white
                    transition
                  "
                  value={form.password}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      password: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                bg-gradient-to-r from-blue-600 to-indigo-600
                hover:from-blue-700 hover:to-indigo-700
                text-white
                py-3.5 rounded-2xl
                font-semibold
                transition
                shadow-lg
                hover:shadow-xl
                flex items-center justify-center gap-2
                disabled:opacity-70
              "
            >

              {loading ? (
                <>
                  <div
                    className="
                      w-5 h-5 border-2 border-white/40
                      border-t-white rounded-full animate-spin
                    "
                  />

                  Loading...
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  Login
                </>
              )}

            </button>

          </form>

          {/* FOOTER */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-400">
              © 2026 SIPERANG - Sistem Peminjaman Barang
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}