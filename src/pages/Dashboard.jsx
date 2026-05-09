import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Package,
  Users,
  Repeat,
  Boxes,
  TrendingUp,
  Activity,
  ShieldCheck,
  Warehouse,
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState({
    products: 0,
    borrowers: 0,
    borrowed: 0,
    stock: 0,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [products, borrowers, borrowed, stock] =
          await Promise.all([
            API.get("/dashboard/products"),
            API.get("/dashboard/borrowers"),
            API.get("/dashboard/borrowed"),
            API.get("/dashboard/stock"),
          ]);

        if (isMounted) {
          setData({
            products: products.data.total_products,
            borrowers: borrowers.data.total_borrowers,
            borrowed: borrowed.data.total_borrowed,
            stock: stock.data.total_stock,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: "Total Barang",
      value: data.products,
      icon: Package,
      bg: "bg-blue-100",
      text: "text-blue-600",
      gradient: "from-blue-500 to-blue-600",
      desc: "Jumlah seluruh barang inventaris",
    },
    {
      title: "Total Peminjam",
      value: data.borrowers,
      icon: Users,
      bg: "bg-green-100",
      text: "text-green-600",
      gradient: "from-green-500 to-green-600",
      desc: "Data seluruh peminjam",
    },
    {
      title: "Sedang Dipinjam",
      value: data.borrowed,
      icon: Repeat,
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      gradient: "from-yellow-500 to-orange-500",
      desc: "Barang yang belum dikembalikan",
    },
    {
      title: "Total Stok",
      value: data.stock,
      icon: Boxes,
      bg: "bg-purple-100",
      text: "text-purple-600",
      gradient: "from-purple-500 to-indigo-600",
      desc: "Akumulasi seluruh stok barang",
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* HERO */}
      <div
        className="
          relative overflow-hidden
          bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600
          rounded-3xl p-6 md:p-8
          text-white shadow-xl
        "
      >

        {/* BACKGROUND DECOR */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
        <div className="absolute bottom-0 right-20 w-24 h-24 bg-white/10 rounded-full" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* LEFT */}
          <div>
            <div className="flex items-center gap-3 mb-3">

              <div
                className="
                  w-14 h-14 rounded-2xl
                  bg-white/20 backdrop-blur-md
                  flex items-center justify-center
                "
              >
                <Warehouse size={28} />
              </div>

              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Dashboard SIPERANG
                </h1>

                <p className="text-blue-100 text-sm md:text-base">
                  Sistem Peminjaman Barang Inventaris
                </p>
              </div>

            </div>

            <p className="text-sm md:text-base text-blue-50 max-w-2xl">
              Pantau seluruh aktivitas inventaris, data peminjam,
              serta status peminjaman barang secara realtime
              melalui dashboard modern SIPERANG.
            </p>
          </div>

          {/* RIGHT */}
          <div
            className="
              bg-white/15 backdrop-blur-md
              rounded-2xl p-5
              border border-white/20
              min-w-[240px]
            "
          >
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={18} />
              <span className="font-semibold">
                Status Sistem
              </span>
            </div>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between">
                <span>Server</span>

                <span
                  className="
                    bg-green-400/20 text-green-100
                    px-2 py-1 rounded-lg text-xs
                  "
                >
                  Online
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Inventaris</span>

                <span className="font-semibold">
                  {data.products} Barang
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Peminjaman Aktif</span>

                <span className="font-semibold">
                  {data.borrowed}
                </span>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white rounded-3xl
                border border-gray-100
                shadow-sm hover:shadow-xl
                transition-all duration-300
                overflow-hidden group
              "
            >

              {/* TOP BAR */}
              <div
                className={`h-2 bg-gradient-to-r ${card.gradient}`}
              />

              <div className="p-5">

                {/* TOP */}
                <div className="flex items-start justify-between mb-5">

                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      {card.title}
                    </p>

                    <h2 className="text-3xl font-bold text-gray-800">
                      {card.value}
                    </h2>
                  </div>

                  <div
                    className={`
                      w-14 h-14 rounded-2xl
                      flex items-center justify-center
                      ${card.bg} ${card.text}
                      group-hover:scale-110 transition-transform
                    `}
                  >
                    <Icon size={26} />
                  </div>

                </div>

                {/* DESC */}
                <div className="flex items-center justify-between">

                  <p className="text-sm text-gray-500">
                    {card.desc}
                  </p>

                  <TrendingUp
                    size={18}
                    className="text-green-500"
                  />

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* INFO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ACTIVITY */}
        <div
          className="
            bg-white rounded-3xl
            border border-gray-100
            shadow-sm p-6
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-12 h-12 rounded-2xl
                bg-blue-100 text-blue-600
                flex items-center justify-center
              "
            >
              <Activity size={22} />
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800">
                Aktivitas Sistem
              </h3>

              <p className="text-sm text-gray-500">
                Ringkasan aktivitas inventaris
              </p>
            </div>

          </div>

          <div className="space-y-4">

            <div
              className="
                flex items-center justify-between
                bg-gray-50 rounded-2xl p-4
              "
            >
              <div>
                <p className="font-medium text-gray-700">
                  Barang Tersedia
                </p>

                <p className="text-sm text-gray-500">
                  Total stok inventaris aktif
                </p>
              </div>

              <span
                className="
                  bg-blue-100 text-blue-700
                  px-4 py-2 rounded-xl
                  font-bold
                "
              >
                {data.stock}
              </span>
            </div>

            <div
              className="
                flex items-center justify-between
                bg-gray-50 rounded-2xl p-4
              "
            >
              <div>
                <p className="font-medium text-gray-700">
                  Peminjaman Aktif
                </p>

                <p className="text-sm text-gray-500">
                  Barang sedang dipinjam
                </p>
              </div>

              <span
                className="
                  bg-yellow-100 text-yellow-700
                  px-4 py-2 rounded-xl
                  font-bold
                "
              >
                {data.borrowed}
              </span>
            </div>

          </div>

        </div>

        {/* QUICK INFO */}
        <div
          className="
            bg-gradient-to-br from-indigo-600 to-blue-600
            rounded-3xl p-6
            text-white shadow-xl
          "
        >

          <div className="flex items-center gap-3 mb-5">

            <div
              className="
                w-12 h-12 rounded-2xl
                bg-white/20
                flex items-center justify-center
              "
            >
              <Package size={22} />
            </div>

            <div>
              <h3 className="text-lg font-bold">
                Informasi SIPERANG
              </h3>

              <p className="text-sm text-blue-100">
                Sistem Inventaris Modern
              </p>
            </div>

          </div>

          <div className="space-y-4 text-sm text-blue-50">

            <div className="bg-white/10 rounded-2xl p-4">
              SIPERANG membantu pengelolaan inventaris
              barang menjadi lebih cepat, tertata,
              dan efisien.
            </div>

            <div className="bg-white/10 rounded-2xl p-4">
              Sistem mendukung pencatatan peminjaman,
              pengembalian barang, dan monitoring stok
              secara realtime.
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}