import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";

import {
  Package,
  User,
  UserPlus,
  Search,
  Building2,
  Phone,
  ClipboardList,
  Boxes,
  CheckCircle2,
  Loader2,
  QrCode,
} from "lucide-react";

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

  // SEARCH STATE
  const [borrowerSearch, setBorrowerSearch] =
    useState("");

  const [showBorrowerList, setShowBorrowerList] =
    useState(false);

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

  // FILTER BORROWER
  const filteredBorrowers = borrowers.filter((b) =>
    b.name
      .toLowerCase()
      .includes(borrowerSearch.toLowerCase())
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
      (!form.name ||
        !form.phone ||
        !form.institution)
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

        borrowerId =
          res.data.id || res.data.data?.id;

        if (!borrowerId) {
          throw new Error(
            "ID borrower tidak ditemukan"
          );
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
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-gradient-to-br from-blue-600 to-indigo-700
        "
      >
        <div
          className="
            bg-white rounded-3xl shadow-2xl
            p-8 text-center
          "
        >
          <Loader2
            size={40}
            className="
              animate-spin text-blue-600 mx-auto mb-4
            "
          />

          <p className="text-gray-600 font-medium">
            Memuat data...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (!product) {
    return (
      <div
        className="
          min-h-screen flex items-center justify-center
          bg-gray-100 p-4
        "
      >
        <div
          className="
            bg-white rounded-3xl shadow-xl
            p-8 text-center max-w-md w-full
          "
        >
          <div
            className="
              w-20 h-20 rounded-full
              bg-red-100 text-red-600
              flex items-center justify-center
              mx-auto mb-4
            "
          >
            <Package size={36} />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Produk Tidak Ditemukan
          </h2>

          <p className="text-gray-500">
            QR Code tidak valid atau barang sudah
            tidak tersedia.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-700
        flex items-center justify-center
        p-4
      "
    >

      {/* CARD */}
      <div
        className="
          w-full max-w-lg
          bg-white/95 backdrop-blur-md
          rounded-3xl shadow-2xl
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            bg-gradient-to-r from-blue-600 to-indigo-600
            text-white p-6
          "
        >

          <div className="flex items-center gap-4">

            <div
              className="
                w-16 h-16 rounded-2xl
                bg-white/20
                flex items-center justify-center
              "
            >
              <QrCode size={32} />
            </div>

            <div>
              <h2 className="text-2xl font-bold">
                Pinjam Barang
              </h2>

              <p className="text-blue-100 text-sm">
                Sistem Peminjaman Inventaris
              </p>
            </div>

          </div>

        </div>

        {/* PRODUCT INFO */}
        <div className="p-6 border-b bg-gray-50">

          <div className="flex items-center gap-4">

            <div
              className="
                w-16 h-16 rounded-2xl
                bg-blue-100 text-blue-600
                flex items-center justify-center
              "
            >
              <Package size={30} />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {product.name}
              </h3>

              <div
                className="
                  inline-flex items-center gap-2
                  mt-2
                  bg-green-100 text-green-700
                  px-3 py-1 rounded-full text-sm
                "
              >
                <Boxes size={15} />
                Stok tersedia: {product.stock}
              </div>
            </div>

          </div>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* MODE */}
          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => setIsNewUser(false)}
              className={`
                p-3 rounded-2xl font-medium transition
                flex items-center justify-center gap-2
                ${
                  !isNewUser
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <User size={18} />
              Pilih Nama
            </button>

            <button
              type="button"
              onClick={() => setIsNewUser(true)}
              className={`
                p-3 rounded-2xl font-medium transition
                flex items-center justify-center gap-2
                ${
                  isNewUser
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }
              `}
            >
              <UserPlus size={18} />
              User Baru
            </button>

          </div>

          {/* SEARCH BORROWER */}
          {!isNewUser && (
            <div className="relative">

              <label className="text-sm text-gray-600 mb-2 block">
                Cari Peminjam
              </label>

              <div className="relative">

                <Search
                  size={18}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  placeholder="Cari nama peminjam..."
                  value={borrowerSearch}
                  onChange={(e) => {
                    setBorrowerSearch(
                      e.target.value
                    );

                    setShowBorrowerList(true);
                  }}
                  className="
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    w-full rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

              {showBorrowerList &&
                borrowerSearch && (
                  <div
                    className="
                      absolute z-20
                      bg-white border border-gray-200
                      w-full max-h-52 overflow-y-auto
                      rounded-2xl shadow-xl mt-2
                    "
                  >

                    {filteredBorrowers.length >
                    0 ? (
                      filteredBorrowers.map((b) => (
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

                            setShowBorrowerList(
                              false
                            );
                          }}
                          className="
                            p-4 hover:bg-gray-50
                            cursor-pointer border-b
                            last:border-b-0
                          "
                        >
                          <div className="font-medium text-gray-800">
                            {b.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {b.phone}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500">
                        Tidak ditemukan
                      </div>
                    )}

                  </div>
                )}

            </div>
          )}

          {/* USER BARU */}
          {isNewUser && (
            <div className="space-y-4">

              {/* NAME */}
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
                  name="name"
                  placeholder="Nama Lengkap"
                  value={form.name}
                  onChange={handleChange}
                  className="
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    w-full rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

              {/* PHONE */}
              <div className="relative">

                <Phone
                  size={18}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  name="phone"
                  placeholder="Nomor HP"
                  value={form.phone}
                  onChange={handleChange}
                  className="
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    w-full rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

              {/* INSTITUTION */}
              <div className="relative">

                <Building2
                  size={18}
                  className="
                    absolute left-4 top-1/2 -translate-y-1/2
                    text-gray-400
                  "
                />

                <input
                  type="text"
                  name="institution"
                  placeholder="Instansi / Asal"
                  value={form.institution}
                  onChange={handleChange}
                  className="
                    border border-gray-200
                    bg-gray-50
                    pl-11 pr-4 py-3
                    w-full rounded-2xl
                    focus:outline-none
                    focus:ring-2 focus:ring-blue-500
                  "
                />
              </div>

            </div>
          )}

          {/* QUANTITY */}
          <div>
            <label className="text-sm text-gray-600 mb-2 block">
              Jumlah Barang
            </label>

            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              min="1"
              max={product.stock}
              className="
                border border-gray-200
                bg-gray-50
                p-3 w-full rounded-2xl
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* PURPOSE */}
          <div className="relative">

            <ClipboardList
              size={18}
              className="
                absolute left-4 top-4 text-gray-400
              "
            />

            <input
              type="text"
              name="purpose"
              placeholder="Keperluan peminjaman..."
              value={form.purpose}
              onChange={handleChange}
              className="
                border border-gray-200
                bg-gray-50
                pl-11 pr-4 py-3
                w-full rounded-2xl
                focus:outline-none
                focus:ring-2 focus:ring-blue-500
              "
            />
          </div>

          {/* BUTTON */}
          <button
            disabled={submitting}
            className={`
              w-full py-3.5 rounded-2xl
              font-semibold text-white
              transition shadow-lg
              flex items-center justify-center gap-2
              ${
                submitting
                  ? "bg-gray-400"
                  : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              }
            `}
          >

            {submitting ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                Pinjam Sekarang
              </>
            )}

          </button>

        </form>

      </div>

    </div>
  );
}