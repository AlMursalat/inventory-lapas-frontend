import { useEffect, useState } from "react";
import API from "../api/api";
import { QRCodeCanvas } from "qrcode.react";

import {
  Search,
  Trash2,
  QrCode,
  Plus,
  MapPin,
  Boxes,
} from "lucide-react";

export default function Products() {
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    stock: "",
    location: "",
    condition: "baik",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const [selectedQR, setSelectedQR] = useState(null);

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // FETCH DATA
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await API.get("/products");

        if (isMounted) {
          setProducts(res.data);
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

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products", form);

      setForm({
        name: "",
        category: "",
        stock: "",
        location: "",
        condition: "baik",
      });

      await fetchProducts();

      alert("Produk berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan produk");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);

      await fetchProducts();

      alert("Produk berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus produk");
    }
  };

  // QR VALUE
  const getQRValue = (product) => {
    return `${BASE_URL}/borrow?product_id=${product.id}`;
  };

  // FILTER
  const filteredData = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // PAGINATION
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;

  const currentData = filteredData.slice(
    indexOfFirst,
    indexOfLast
  );

  const totalPages = Math.ceil(
    filteredData.length / itemsPerPage
  );

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manajemen Barang
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola data inventaris barang SIPERANG
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-3 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari nama barang..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="
              w-full pl-10 pr-4 py-3
              rounded-xl border border-gray-200
              focus:outline-none focus:ring-2 focus:ring-blue-500
              bg-white shadow-sm
            "
          />
        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="
          bg-white rounded-2xl shadow-sm border border-gray-100
          p-5 mb-6
        "
      >

        <div className="flex items-center gap-2 mb-5">
          <Plus size={20} className="text-blue-600" />

          <h2 className="font-semibold text-lg text-gray-800">
            Tambah Barang
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Nama Barang
            </label>

            <input
              type="text"
              name="name"
              placeholder="Masukkan nama barang"
              value={form.name}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Kategori
            </label>

            <input
              type="text"
              name="category"
              placeholder="Kategori barang"
              value={form.category}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Stok
            </label>

            <input
              type="number"
              name="stock"
              placeholder="Jumlah stok"
              value={form.stock}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Lokasi
            </label>

            <input
              type="text"
              name="location"
              placeholder="Lokasi penyimpanan"
              value={form.location}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

        </div>

        <button
          className="
            mt-5
            bg-blue-600 hover:bg-blue-700
            text-white font-medium
            px-5 py-3 rounded-xl
            transition shadow-md
            flex items-center gap-2
          "
        >
          <Plus size={18} />
          Tambah Produk
        </button>

      </form>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm">
                <th className="p-4 text-left">Nama Barang</th>
                <th className="p-4 text-left">Kategori</th>
                <th className="p-4 text-left">Stok</th>
                <th className="p-4 text-left">Lokasi</th>
                <th className="p-4 text-center">QR</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {currentData.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium text-gray-800">
                    {p.name}
                  </td>

                  <td className="p-4 text-gray-600">
                    {p.category || "-"}
                  </td>

                  <td className="p-4">
                    <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                      <Boxes size={15} />
                      {p.stock}
                    </div>
                  </td>

                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin size={15} />
                      {p.location || "-"}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedQR(p)}
                      className="
                        bg-purple-600 hover:bg-purple-700
                        text-white px-4 py-2 rounded-xl
                        transition inline-flex items-center gap-2
                      "
                    >
                      <QrCode size={17} />
                      QR
                    </button>
                  </td>

                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="
                        bg-red-500 hover:bg-red-600
                        text-white px-4 py-2 rounded-xl
                        transition inline-flex items-center gap-2
                      "
                    >
                      <Trash2 size={17} />
                      Hapus
                    </button>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-center gap-2 p-5 border-t">

          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="
              px-4 py-2 rounded-lg border
              disabled:opacity-50
              hover:bg-gray-100 transition
            "
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`
                px-4 py-2 rounded-lg border transition
                ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white border-blue-600"
                    : "hover:bg-gray-100"
                }
              `}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="
              px-4 py-2 rounded-lg border
              disabled:opacity-50
              hover:bg-gray-100 transition
            "
          >
            Next
          </button>

        </div>

      </div>

      {/* MOBILE CARD */}
      <div className="md:hidden space-y-4">

        {currentData.map((p) => (
          <div
            key={p.id}
            className="
              bg-white rounded-2xl shadow-sm border border-gray-100
              p-4 space-y-3
            "
          >

            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-lg text-gray-800">
                  {p.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {p.category || "-"}
                </p>
              </div>

              <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                {p.stock}
              </div>
            </div>

            <div className="text-sm text-gray-600 flex items-center gap-1">
              <MapPin size={15} />
              {p.location || "-"}
            </div>

            <div className="flex gap-2 pt-2">

              <button
                onClick={() => setSelectedQR(p)}
                className="
                  flex-1
                  bg-purple-600 hover:bg-purple-700
                  text-white py-2 rounded-xl
                  transition flex items-center justify-center gap-2
                "
              >
                <QrCode size={17} />
                QR
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="
                  flex-1
                  bg-red-500 hover:bg-red-600
                  text-white py-2 rounded-xl
                  transition flex items-center justify-center gap-2
                "
              >
                <Trash2 size={17} />
                Hapus
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* QR MODAL */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div
            className="
              bg-white rounded-3xl shadow-2xl
              w-full max-w-sm
              p-6 text-center
              animate-fadeIn
            "
          >

            <div className="flex justify-center mb-3">
              <div className="bg-purple-100 text-purple-700 p-4 rounded-2xl">
                <QrCode size={28} />
              </div>
            </div>

            <h3 className="text-xl font-bold text-gray-800">
              {selectedQR.name}
            </h3>

            <p className="text-sm text-gray-500 mt-1 mb-5">
              Scan QR untuk melakukan peminjaman barang
            </p>

            {/* QR CENTER */}
            <div className="flex justify-center items-center mb-5">
              <div className="bg-white p-4 rounded-2xl border shadow-sm">
                <QRCodeCanvas
                  value={getQRValue(selectedQR)}
                  size={220}
                />
              </div>
            </div>

            <div className="bg-gray-50 border rounded-xl p-3 mb-5">
              <p className="text-xs text-gray-500 break-all">
                {getQRValue(selectedQR)}
              </p>
            </div>

            <button
              onClick={() => setSelectedQR(null)}
              className="
                w-full
                bg-blue-600 hover:bg-blue-700
                text-white font-medium
                py-3 rounded-xl
                transition
              "
            >
              Tutup
            </button>

          </div>

        </div>
      )}
    </div>
  );
}