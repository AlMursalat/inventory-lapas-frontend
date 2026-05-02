import { useEffect, useState } from "react";
import API from "../api/api";

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
    b.name.toLowerCase().includes(borrowerSearch.toLowerCase())
  );

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FORMAT TANGGAL
  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID");
  };

  // REFRESH
  const refreshData = async () => {
    const res = await API.get("/borrowings");
    setBorrowings(res.data);
  };

  // PINJAM
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
    if (!confirm("Yakin ingin menghapus data ini?")) return;

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
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Manajemen Peminjaman</h2>
        <p className="text-gray-500 text-sm">
          Kelola peminjaman dan pengembalian barang
        </p>
      </div>

      {/* FILTER */}
      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1 rounded ${
            statusFilter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Semua
        </button>

        <button
          onClick={() => setStatusFilter("borrowed")}
          className={`px-3 py-1 rounded ${
            statusFilter === "borrowed"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200"
          }`}
        >
          Dipinjam
        </button>

        <button
          onClick={() => setStatusFilter("returned")}
          className={`px-3 py-1 rounded ${
            statusFilter === "returned"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Dikembalikan
        </button>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow mb-6 space-y-3"
      >
        {/* PRODUCT */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari barang..."
            value={productSearch}
            onChange={(e) => {
              setProductSearch(e.target.value);
              setShowProductList(true);
            }}
            className="border p-2 rounded w-full"
          />

          {showProductList && (
            <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10 rounded shadow">
              {filteredProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => {
                    setForm({ ...form, product_id: p.id });
                    setProductSearch(`${p.name} (stok: ${p.stock})`);
                    setShowProductList(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {p.name} (stok: {p.stock})
                </div>
              ))}
            </div>
          )}
        </div>

        {/* BORROWER */}
        <div className="relative">
          <input
            type="text"
            placeholder="Cari peminjam..."
            value={borrowerSearch}
            onChange={(e) => {
              setBorrowerSearch(e.target.value);
              setShowBorrowerList(true);
            }}
            className="border p-2 rounded w-full"
          />

          {showBorrowerList && (
            <div className="absolute bg-white border w-full max-h-40 overflow-y-auto z-10 rounded shadow">
              {filteredBorrowers.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setForm({ ...form, borrower_id: b.id });
                    setBorrowerSearch(`${b.name} (${b.phone})`);
                    setShowBorrowerList(false);
                  }}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  {b.name} ({b.phone})
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="number"
          name="quantity"
          value={form.quantity}
          onChange={handleChange}
          className="border p-2 rounded w-full"
          min="1"
        />

        <input
          type="text"
          name="purpose"
          placeholder="Keperluan"
          value={form.purpose}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Pinjam Barang
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Barang</th>
              <th className="p-3 text-left">Peminjam</th>
              <th className="p-3 text-left">Jumlah</th>
              <th className="p-3 text-left">Keperluan</th>
              <th className="p-3 text-left">Tgl Pinjam</th>
              <th className="p-3 text-left">Tgl Kembali</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {filteredBorrowings.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.product_name}</td>
                <td>{b.borrower_name}</td>
                <td>{b.quantity}</td>
                <td>{b.purpose || "-"}</td>
                <td>{formatDate(b.borrow_date)}</td>
                <td>{formatDate(b.return_date)}</td>
                <td>
                  {b.status === "borrowed"
                    ? "Dipinjam"
                    : "Dikembalikan"}
                </td>
                <td className="flex gap-2 p-3">
                  {b.status === "borrowed" && (
                    <button
                      onClick={() => handleReturn(b.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded"
                    >
                      Kembalikan
                    </button>
                  )}

                  {b.status === "returned" && (
                    <button
                      onClick={() => handleDelete(b.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}