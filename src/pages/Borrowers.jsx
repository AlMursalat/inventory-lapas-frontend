import { useEffect, useState } from "react";
import API from "../api/api";

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([]);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    institution: "",
  });

  // FETCH DATA (AMAN)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const res = await API.get("/borrowers");
        if (isMounted) setBorrowers(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // REFRESH
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
        <h2 className="text-xl md:text-2xl font-bold">Peminjam</h2>
        <p className="text-gray-500 text-sm">
          Kelola data peminjam barang
        </p>
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
            placeholder="Nama"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Nomor HP"
            value={form.phone}
            onChange={handleChange}
            className="border p-2 rounded w-full"
            required
          />

          <input
            type="text"
            name="institution"
            placeholder="Instansi"
            value={form.institution}
            onChange={handleChange}
            className="border p-2 rounded w-full md:col-span-2"
          />
        </div>

        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition w-full md:w-auto">
          Tambah Peminjam
        </button>
      </form>

      {/* TABLE (DESKTOP) */}
      <div className="hidden md:block bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Nama</th>
              <th className="p-3 text-left">HP</th>
              <th className="p-3 text-left">Instansi</th>
              <th className="p-3 text-left">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {borrowers.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.name}</td>
                <td>{b.phone}</td>
                <td>{b.institution}</td>
                <td>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CARD (MOBILE) */}
      <div className="md:hidden space-y-3">
        {borrowers.map((b) => (
          <div
            key={b.id}
            className="bg-white p-4 rounded-xl shadow space-y-2"
          >
            <div className="font-semibold text-lg">{b.name}</div>
            <div className="text-sm">HP: {b.phone}</div>
            <div className="text-sm text-gray-500">
              Instansi: {b.institution || "-"}
            </div>

            <button
              onClick={() => handleDelete(b.id)}
              className="bg-red-500 text-white px-3 py-1 rounded w-full"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}