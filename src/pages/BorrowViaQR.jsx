import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function BorrowViaQR() {
  const [searchParams] = useSearchParams();
  const product_id = searchParams.get("product_id");

  const [product, setProduct] = useState(null);
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    borrower_id: "",
    name: "",
    phone: "",
    institution: "",
    quantity: 1,
    purpose: "",
  });

  const [isNewUser, setIsNewUser] = useState(false);

  // 🔥 SEARCH STATE (NEW)
  const [borrowerSearch, setBorrowerSearch] = useState("");
  const [showBorrowerList, setShowBorrowerList] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [p, b] = await Promise.all([
          API.get(`/products/${product_id}`),
          API.get("/borrowers"),
        ]);

        setProduct(p.data);
        setBorrowers(b.data);
      } catch (err) {
        console.error(err);
        alert("Gagal memuat data");
      } finally {
        setLoading(false);
      }
    };

    if (product_id) fetchData();
  }, [product_id]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // FILTER BORROWER (SEARCH)
  const filteredBorrowers = borrowers.filter((b) =>
    b.name.toLowerCase().includes(borrowerSearch.toLowerCase())
  );

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!product) return;

    if (form.quantity > product.stock) {
      alert("Jumlah melebihi stok!");
      return;
    }

    if (!isNewUser && !form.borrower_id) {
      alert("Pilih nama peminjam!");
      return;
    }

    if (
      isNewUser &&
      (!form.name || !form.phone || !form.institution)
    ) {
      alert("Lengkapi data peminjam!");
      return;
    }

    setSubmitting(true);

    try {
      let borrowerId = form.borrower_id;

      // USER BARU
      if (isNewUser) {
        const res = await API.post("/borrowers", {
          name: form.name,
          phone: form.phone,
          institution: form.institution,
        });

        borrowerId = res.data.id || res.data.data?.id;

        if (!borrowerId) {
          throw new Error("ID borrower tidak ditemukan");
        }
      }

      // PINJAM
      await API.post("/borrowings/borrow", {
        product_id: Number(product_id),
        borrower_id: borrowerId,
        quantity: Number(form.quantity),
        purpose: form.purpose,
      });

      alert("✅ Berhasil meminjam barang");

      // RESET
      setForm({
        borrower_id: "",
        name: "",
        phone: "",
        institution: "",
        quantity: 1,
        purpose: "",
      });

      setBorrowerSearch("");

    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "❌ Gagal meminjam"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // ERROR
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Produk tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-md">

        <h2 className="text-xl font-bold text-center mb-2">
          Pinjam Barang
        </h2>

        <div className="text-center mb-4">
          <p className="font-semibold text-lg">{product.name}</p>
          <p className="text-sm text-gray-500">
            Stok tersedia: {product.stock}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">

          {/* MODE */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setIsNewUser(false)}
              className={`flex-1 p-2 rounded ${
                !isNewUser ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Pilih Nama
            </button>

            <button
              type="button"
              onClick={() => setIsNewUser(true)}
              className={`flex-1 p-2 rounded ${
                isNewUser ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              User Baru
            </button>
          </div>

          {/* 🔥 SEARCHABLE BORROWER (NEW) */}
          {!isNewUser && (
            <div className="relative">

              <input
                type="text"
                placeholder="Cari nama peminjam..."
                value={borrowerSearch}
                onChange={(e) => {
                  setBorrowerSearch(e.target.value);
                  setShowBorrowerList(true);
                }}
                className="border p-2 w-full rounded"
              />

              {showBorrowerList && borrowerSearch && (
                <div className="absolute z-10 bg-white border w-full max-h-40 overflow-y-auto rounded shadow">

                  {filteredBorrowers.length > 0 ? (
                    filteredBorrowers.map((b) => (
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
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">
                      Tidak ditemukan
                    </div>
                  )}

                </div>
              )}

            </div>
          )}

          {/* USER BARU */}
          {isNewUser && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Nama"
                value={form.name}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                type="text"
                name="phone"
                placeholder="No HP"
                value={form.phone}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />

              <input
                type="text"
                name="institution"
                placeholder="Instansi / Asal"
                value={form.institution}
                onChange={handleChange}
                className="border p-2 w-full rounded"
              />
            </>
          )}

          {/* JUMLAH */}
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            max={product.stock}
            className="border p-2 w-full rounded"
          />

          {/* PURPOSE */}
          <input
            type="text"
            name="purpose"
            placeholder="Keperluan"
            value={form.purpose}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <button
            disabled={submitting}
            className={`w-full py-2 rounded text-white ${
              submitting
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {submitting ? "Memproses..." : "Pinjam Sekarang"}
          </button>

        </form>
      </div>
    </div>
  );
}