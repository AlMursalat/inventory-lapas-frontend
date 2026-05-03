import { useEffect, useState } from "react";
import API from "../api/api";
import { QRCodeCanvas } from "qrcode.react";

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

  // 🔎 SEARCH + PAGINATION STATE
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // FETCH DATA
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await API.get("/products");
        if (isMounted) setProducts(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const fetchProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

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

  const handleDelete = async (id) => {
    try {
      await API.delete(`/products/${id}`);
      await fetchProducts();
      alert("Produk dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  const getQRValue = (product) => {
    return `${BASE_URL}/borrow?product_id=${product.id}`;
  };

  // =========================
  // FILTER SEARCH
  // =========================
  const filteredData = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // =========================
  // PAGINATION LOGIC
  // =========================
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const goToPage = (page) => setCurrentPage(page);

  return (
    <div className="p-4 md:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold">Barang</h2>
        <p className="text-gray-500 text-sm">
          Kelola data barang inventaris
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Cari nama barang..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border p-2 rounded w-full md:w-1/3"
        />
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-xl shadow mb-6 space-y-3"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            name="name"
            placeholder="Nama barang"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="category"
            placeholder="Kategori"
            value={form.category}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stok"
            value={form.stock}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            name="location"
            placeholder="Lokasi"
            value={form.location}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full md:w-auto">
          Tambah Produk
        </button>
      </form>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">Kategori</th>
              <th className="p-3 text-left">Stok</th>
              <th className="p-3 text-left">Lokasi</th>
              <th className="p-3 text-left">QR</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td>{p.category}</td>
                <td>{p.stock}</td>
                <td>{p.location}</td>

                <td>
                  <button
                    onClick={() => setSelectedQR(p)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    QR
                  </button>
                </td>

                <td>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-2 p-4">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => goToPage(i + 1)}
              className={`px-3 py-1 border rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">
        {currentData.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-xl shadow space-y-2">
            <div className="font-semibold text-lg">{p.name}</div>
            <div className="text-sm text-gray-500">
              Kategori: {p.category || "-"}
            </div>
            <div className="text-sm">Stok: {p.stock}</div>
            <div className="text-sm">Lokasi: {p.location}</div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedQR(p)}
                className="bg-purple-600 text-white px-3 py-1 rounded w-full"
              >
                QR
              </button>

              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-500 text-white px-3 py-1 rounded w-full"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {/* PAGINATION MOBILE */}
        <div className="flex justify-center gap-2 pt-3">
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>

          <button className="px-3 py-1 border rounded bg-gray-100">
            {currentPage} / {totalPages}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODAL QR */}
      {selectedQR && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-center shadow max-w-sm w-full">
            <h3 className="font-bold text-lg">{selectedQR.name}</h3>

            <QRCodeCanvas value={getQRValue(selectedQR)} size={200} />

            <p className="text-xs mt-3 break-all">
              {getQRValue(selectedQR)}
            </p>

            <button
              onClick={() => setSelectedQR(null)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}