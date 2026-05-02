import { useEffect, useState } from "react";
import API from "../api/api";
import { Package, Users, Repeat, Boxes } from "lucide-react";

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

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold">
          Dashboard
        </h1>
        <p className="text-gray-500 text-sm">
          Ringkasan data peminjaman barang
        </p>
      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* PRODUCTS */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Total Barang</p>
            <h2 className="text-2xl font-bold">{data.products}</h2>
          </div>
          <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
            <Package size={24} />
          </div>
        </div>

        {/* BORROWERS */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Total Peminjam</p>
            <h2 className="text-2xl font-bold">{data.borrowers}</h2>
          </div>
          <div className="bg-green-100 text-green-600 p-3 rounded-lg">
            <Users size={24} />
          </div>
        </div>

        {/* BORROWED */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Sedang Dipinjam</p>
            <h2 className="text-2xl font-bold">{data.borrowed}</h2>
          </div>
          <div className="bg-yellow-100 text-yellow-600 p-3 rounded-lg">
            <Repeat size={24} />
          </div>
        </div>

        {/* STOCK */}
        <div className="bg-white rounded-xl shadow p-4 flex items-center justify-between hover:shadow-md transition">
          <div>
            <p className="text-sm text-gray-500">Total Stok</p>
            <h2 className="text-2xl font-bold">{data.stock}</h2>
          </div>
          <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
            <Boxes size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}