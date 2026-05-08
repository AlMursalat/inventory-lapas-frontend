import { useEffect, useState } from "react";
import API from "../api/api";

import {
  PackageCheck,
  Search,
  ClipboardList,
  RotateCcw,
  Trash2,
  CheckCircle2,
  Clock3,
  User,
  Boxes,
  Plus,
} from "lucide-react";

export default function Borrowings() {
  const [borrowings, setBorrowings] = useState([]);
  const [products, setProducts] = useState([]);
  const [borrowers, setBorrowers] = useState([]);

  const [form, setForm] = useState({
    product_id: "",
    borrower_id: "",
    purpose: "",
    quantity: 1,
  });

  const [statusFilter, setStatusFilter] = useState("all");

  const [productSearch, setProductSearch] = useState("");
  const [borrowerSearch, setBorrowerSearch] = useState("");

  const [showProductList, setShowProductList] = useState(false);
  const [showBorrowerList, setShowBorrowerList] = useState(false);

  // FETCH DATA
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const [b, p, br] = await Promise.all([
          API.get("/borrowings"),
          API.get("/products"),
          API.get("/borrowers"),
        ]);

        if (isMounted) {
          setBorrowings(b.data);
          setProducts(p.data);
          setBorrowers(br.data);
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

  // FILTER STATUS
  const filteredBorrowings = borrowings.filter((b) => {
    if (statusFilter === "all") return true;
    return b.status === statusFilter;
  });

  // FILTER SEARCH
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredBorrowers = borrowers.filter((b) =>
    b.name.toLowerCase().includes(
      borrowerSearch.toLowerCase()
    )
  );

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FORMAT DATE
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("id-ID");
  };

  // REFRESH
  const refreshData = async () => {
    const res = await API.get("/borrowings");
    setBorrowings(res.data);
  };

  // BORROW
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const selectedProduct = products.find(
        (p) => p.id == form.product_id
      );

      if (!selectedProduct) {
        alert("Pilih barang dulu");
        return;
      }

      if (form.quantity > selectedProduct.stock) {
        alert("Jumlah melebihi stok!");
        return;
      }

      await API.post("/borrowings/borrow", form);

      setForm({
        product_id: "",
        borrower_id: "",
        purpose: "",
        quantity: 1,
      });

      setProductSearch("");
      setBorrowerSearch("");

      await refreshData();

      alert("Berhasil meminjam");
    } catch (err) {
      console.error(err);
      alert("Gagal meminjam");
    }
  };

  // RETURN
  const handleReturn = async (id) => {
    try {
      await API.post("/borrowings/return", {
        id,
        condition_return: "baik",
      });

      await refreshData();

      alert("Barang dikembalikan");
    } catch (err) {
      console.error(err);
      alert("Gagal mengembalikan");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus data ini?"))
      return;

    try {
      await API.delete(`/borrowings/${id}`);

      await refreshData();

      alert("Data dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Manajemen Peminjaman
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola peminjaman dan pengembalian barang
          </p>
        </div>

        {/* FILTER */}
        <div className="flex flex-wrap gap-2">

          <button
            onClick={() => setStatusFilter("all")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-white border hover:bg-gray-50"
              }
            `}
          >
            Semua
          </button>

          <button
            onClick={() => setStatusFilter("borrowed")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                statusFilter === "borrowed"
                  ? "bg-yellow-500 text-white shadow"
                  : "bg-white border hover:bg-gray-50"
              }
            `}
          >
            Dipinjam
          </button>

          <button
            onClick={() => setStatusFilter("returned")}
            className={`
              px-4 py-2 rounded-xl text-sm font-medium transition
              ${
                statusFilter === "returned"
                  ? "bg-green-600 text-white shadow"
                  : "bg-white border hover:bg-gray-50"
              }
            `}
          >
            Dikembalikan
          </button>

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
            Form Peminjaman
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* PRODUCT */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Barang
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari barang..."
                value={productSearch}
                onChange={(e) => {
                  setProductSearch(e.target.value);
                  setShowProductList(true);
                }}
                className="
                  border border-gray-200
                  pl-10 pr-3 py-3 rounded-xl w-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>

            {showProductList && (
              <div
                className="
                  absolute bg-white border border-gray-200
                  w-full max-h-52 overflow-y-auto
                  z-20 rounded-xl shadow-lg mt-1
                "
              >
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setForm({
                        ...form,
                        product_id: p.id,
                      });

                      setProductSearch(
                        `${p.name} (stok: ${p.stock})`
                      );

                      setShowProductList(false);
                    }}
                    className="
                      p-3 hover:bg-gray-50 cursor-pointer
                      border-b last:border-b-0
                    "
                  >
                    <div className="font-medium text-gray-800">
                      {p.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      Stok tersedia: {p.stock}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* BORROWER */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Peminjam
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-3 top-3.5 text-gray-400"
              />

              <input
                type="text"
                placeholder="Cari peminjam..."
                value={borrowerSearch}
                onChange={(e) => {
                  setBorrowerSearch(e.target.value);
                  setShowBorrowerList(true);
                }}
                className="
                  border border-gray-200
                  pl-10 pr-3 py-3 rounded-xl w-full
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>

            {showBorrowerList && (
              <div
                className="
                  absolute bg-white border border-gray-200
                  w-full max-h-52 overflow-y-auto
                  z-20 rounded-xl shadow-lg mt-1
                "
              >
                {filteredBorrowers.map((b) => (
                  <div
                    key={b.id}
                    onClick={() => {
                      setForm({
                        ...form,
                        borrower_id: b.id,
                      });

                      setBorrowerSearch(
                        `${b.name} (${b.phone})`
                      );

                      setShowBorrowerList(false);
                    }}
                    className="
                      p-3 hover:bg-gray-50 cursor-pointer
                      border-b last:border-b-0
                    "
                  >
                    <div className="font-medium text-gray-800">
                      {b.name}
                    </div>

                    <div className="text-sm text-gray-500">
                      {b.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* QUANTITY */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Jumlah
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              min="1"
            />
          </div>

          {/* PURPOSE */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Keperluan
            </label>

            <input
              type="text"
              name="purpose"
              placeholder="Masukkan keperluan..."
              value={form.purpose}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

        </div>

        {/* BUTTON */}
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
          <PackageCheck size={18} />
          Pinjam Barang
        </button>

      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm">
                <th className="p-4 text-left">Barang</th>
                <th className="p-4 text-left">Peminjam</th>
                <th className="p-4 text-left">Jumlah</th>
                <th className="p-4 text-left">Keperluan</th>
                <th className="p-4 text-left">Tgl Pinjam</th>
                <th className="p-4 text-left">Tgl Kembali</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {filteredBorrowings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* BARANG */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-10 h-10 rounded-full
                          bg-blue-100 text-blue-700
                          flex items-center justify-center
                        "
                      >
                        <Boxes size={18} />
                      </div>

                      <div className="font-medium text-gray-800">
                        {b.product_name}
                      </div>

                    </div>
                  </td>

                  {/* PEMINJAM */}
                  <td className="p-4 text-gray-700">
                    {b.borrower_name}
                  </td>

                  {/* JUMLAH */}
                  <td className="p-4">
                    <span
                      className="
                        bg-blue-50 text-blue-700
                        px-3 py-1 rounded-full
                        text-sm font-medium
                      "
                    >
                      {b.quantity}
                    </span>
                  </td>

                  {/* PURPOSE */}
                  <td className="p-4 text-gray-600">
                    {b.purpose || "-"}
                  </td>

                  {/* TGL */}
                  <td className="p-4 text-gray-600">
                    {formatDate(b.borrow_date)}
                  </td>

                  <td className="p-4 text-gray-600">
                    {formatDate(b.return_date)}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    {b.status === "borrowed" ? (
                      <div
                        className="
                          inline-flex items-center gap-2
                          bg-yellow-100 text-yellow-700
                          px-3 py-1 rounded-full text-sm
                        "
                      >
                        <Clock3 size={15} />
                        Dipinjam
                      </div>
                    ) : (
                      <div
                        className="
                          inline-flex items-center gap-2
                          bg-green-100 text-green-700
                          px-3 py-1 rounded-full text-sm
                        "
                      >
                        <CheckCircle2 size={15} />
                        Dikembalikan
                      </div>
                    )}
                  </td>

                  {/* AKSI */}
                  <td className="p-4">
                    <div className="flex justify-center gap-2">

                      {b.status === "borrowed" && (
                        <button
                          onClick={() => handleReturn(b.id)}
                          className="
                            bg-green-600 hover:bg-green-700
                            text-white px-4 py-2 rounded-xl
                            transition inline-flex items-center gap-2
                          "
                        >
                          <RotateCcw size={16} />
                          Kembalikan
                        </button>
                      )}

                      {b.status === "returned" && (
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="
                            bg-red-500 hover:bg-red-600
                            text-white px-4 py-2 rounded-xl
                            transition inline-flex items-center gap-2
                          "
                        >
                          <Trash2 size={16} />
                          Hapus
                        </button>
                      )}

                    </div>
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}
        {filteredBorrowings.length === 0 && (
          <div className="p-10 text-center text-gray-500">

            <div className="flex justify-center mb-3">
              <ClipboardList
                size={40}
                className="text-gray-300"
              />
            </div>

            <p>Tidak ada data peminjaman</p>

          </div>
        )}

      </div>
    </div>
  );
}