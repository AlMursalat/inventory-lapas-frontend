import { useEffect, useState } from "react";
import API from "../api/api";

import {
  Search,
  Trash2,
  Plus,
  Users,
  Phone,
  Building2,
} from "lucide-react";

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    institution: "",
  });

  // SEARCH + PAGINATION
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  // FETCH DATA
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await API.get("/borrowers");

        if (isMounted) {
          setBorrowers(res.data);
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

  // INPUT FORM
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // REFRESH DATA
  const fetchBorrowers = async () => {
    const res = await API.get("/borrowers");
    setBorrowers(res.data);
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/borrowers", form);

      setForm({
        name: "",
        phone: "",
        institution: "",
      });

      await fetchBorrowers();

      alert("Peminjam berhasil ditambahkan");
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    try {
      await API.delete(`/borrowers/${id}`);

      await fetchBorrowers();

      alert("Data berhasil dihapus");
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus");
    }
  };

  // FILTER SEARCH
  const filteredData = borrowers.filter((b) =>
    b.name.toLowerCase().includes(search.toLowerCase())
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
            Data Peminjam
          </h1>

          <p className="text-gray-500 mt-1">
            Kelola data peminjam barang SIPERANG
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
            placeholder="Cari nama peminjam..."
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
            Tambah Peminjam
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* NAMA */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Nama Peminjam
            </label>

            <input
              type="text"
              name="name"
              placeholder="Masukkan nama peminjam"
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

          {/* HP */}
          <div>
            <label className="text-sm text-gray-600 mb-1 block">
              Nomor HP
            </label>

            <input
              type="text"
              name="phone"
              placeholder="Masukkan nomor HP"
              value={form.phone}
              onChange={handleChange}
              className="
                border border-gray-200
                p-3 rounded-xl w-full
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              required
            />
          </div>

          {/* INSTANSI */}
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">
              Instansi
            </label>

            <input
              type="text"
              name="institution"
              placeholder="Masukkan nama instansi"
              value={form.institution}
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
          <Plus size={18} />
          Tambah Peminjam
        </button>

      </form>

      {/* TABLE DESKTOP */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">
              <tr className="text-gray-600 text-sm">
                <th className="p-4 text-left">Nama</th>
                <th className="p-4 text-left">Nomor HP</th>
                <th className="p-4 text-left">Instansi</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>

              {currentData.map((b) => (
                <tr
                  key={b.id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  {/* NAMA */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">

                      <div
                        className="
                          w-10 h-10 rounded-full
                          bg-blue-100 text-blue-700
                          flex items-center justify-center
                        "
                      >
                        <Users size={18} />
                      </div>

                      <div>
                        <p className="font-medium text-gray-800">
                          {b.name}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* PHONE */}
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Phone size={16} />
                      {b.phone}
                    </div>
                  </td>

                  {/* INSTANSI */}
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} />
                      {b.institution || "-"}
                    </div>
                  </td>

                  {/* AKSI */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(b.id)}
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

        {currentData.map((b) => (
          <div
            key={b.id}
            className="
              bg-white rounded-2xl shadow-sm border border-gray-100
              p-4 space-y-3
            "
          >

            <div className="flex items-start gap-3">

              <div
                className="
                  w-11 h-11 rounded-full
                  bg-blue-100 text-blue-700
                  flex items-center justify-center
                  shrink-0
                "
              >
                <Users size={18} />
              </div>

              <div className="flex-1">
                <h2 className="font-semibold text-lg text-gray-800">
                  {b.name}
                </h2>

                <div className="text-sm text-gray-600 mt-1 flex items-center gap-2">
                  <Phone size={15} />
                  {b.phone}
                </div>

                <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <Building2 size={15} />
                  {b.institution || "-"}
                </div>
              </div>

            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleDelete(b.id)}
              className="
                w-full
                bg-red-500 hover:bg-red-600
                text-white py-2.5 rounded-xl
                transition flex items-center justify-center gap-2
              "
            >
              <Trash2 size={17} />
              Hapus
            </button>

          </div>
        ))}

        {/* PAGINATION MOBILE */}
        <div className="flex justify-center gap-2 pt-3">

          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="
              px-4 py-2 border rounded-lg
              disabled:opacity-50
            "
          >
            Prev
          </button>

          <button className="px-4 py-2 border rounded-lg bg-gray-100">
            {currentPage} / {totalPages}
          </button>

          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="
              px-4 py-2 border rounded-lg
              disabled:opacity-50
            "
          >
            Next
          </button>

        </div>

      </div>
    </div>
  );
}