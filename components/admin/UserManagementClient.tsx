"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Users,
  ShieldCheck,
  Crown,
  Search,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Building2,
  User,
  Trash2,
  X,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  role: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export default function UserManagementClient() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("ALL");
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modal State Tambah User
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newRole, setNewRole] = useState("ADMIN");
  const [newIsVerified, setNewIsVerified] = useState(true);
  const [creatingUser, setCreatingUser] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        setErrorMessage(data.error || "Gagal memuat data akun.");
      }
    } catch {
      setErrorMessage("Terjadi kesalahan jaringan saat memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    fetch("/api/admin/users")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && Array.isArray(data.users)) {
          setUsers(data.users);
        }
      })
      .catch(() => {
        if (isMounted) setErrorMessage("Terjadi kesalahan jaringan saat memuat data.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Handler ubah role (Beri / Cabut akses admin)
  const handleUpdateRole = async (id: string, role: string) => {
    setActionLoadingId(id);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, role }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, role: data.user.role } : u))
        );
      } else {
        setErrorMessage(data.error || "Gagal memperbarui hak akses.");
      }
    } catch {
      setErrorMessage("Kendala jaringan saat memperbarui hak akses.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler toggle verifikasi
  const handleToggleVerify = async (id: string, currentStatus: boolean) => {
    setActionLoadingId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_verified: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          `Status verifikasi ${data.user.email} diubah menjadi ${
            data.user.is_verified ? "Terverifikasi" : "Belum Verifikasi"
          }.`
        );
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, is_verified: data.user.is_verified } : u))
        );
      }
    } catch {
      setErrorMessage("Gagal mengubah status verifikasi.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler hapus akun
  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun ${email}? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setActionLoadingId(id);
    try {
      const res = await fetch(`/api/admin/users?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } else {
        setErrorMessage(data.error || "Gagal menghapus akun.");
      }
    } catch {
      setErrorMessage("Gagal menghubungi server untuk menghapus akun.");
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handler form submit tambah user
  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          name: newName,
          phone: newPhone,
          role: newRole,
          is_verified: newIsVerified,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(data.message);
        setIsAddModalOpen(false);
        setNewEmail("");
        setNewName("");
        setNewPhone("");
        setUsers((prev) => [data.user, ...prev]);
      } else {
        setErrorMessage(data.error || "Gagal mendaftarkan akun baru.");
      }
    } catch {
      setErrorMessage("Kendala jaringan saat membuat akun baru.");
    } finally {
      setCreatingUser(false);
    }
  };

  // Hitungan statistik
  const stats = useMemo(() => {
    const total = users.length;
    const adminCount = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN").length;
    const ownerCount = users.filter((u) => u.role === "OWNER").length;
    const verifiedCount = users.filter((u) => u.is_verified).length;
    return { total, adminCount, ownerCount, verifiedCount };
  }, [users]);

  // Filter list
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const q = searchQuery.toLowerCase();
      const matchQuery =
        !q ||
        u.email.toLowerCase().includes(q) ||
        (u.name && u.name.toLowerCase().includes(q)) ||
        (u.phone && u.phone.includes(q));

      if (!matchQuery) return false;

      if (selectedRoleFilter === "ADMIN") {
        return u.role === "SUPER_ADMIN" || u.role === "ADMIN";
      }
      if (selectedRoleFilter === "OWNER") {
        return u.role === "OWNER";
      }
      if (selectedRoleFilter === "USER") {
        return u.role === "USER";
      }
      return true;
    });
  }, [users, searchQuery, selectedRoleFilter]);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
            <Crown className="w-3 h-3 text-amber-500" />
            <span>Super Admin</span>
          </span>
        );
      case "ADMIN":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-[#3D77EE] border border-blue-200">
            <ShieldCheck className="w-3 h-3" />
            <span>Administrator</span>
          </span>
        );
      case "OWNER":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            <Building2 className="w-3 h-3" />
            <span>Mitra Owner</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <User className="w-3 h-3" />
            <span>Pengguna</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-[8px] bg-blue-50 text-[#3D77EE]">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827]">
              Manajemen Akun &amp; Hak Akses Administrator
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#687280] mt-1">
            Pantau seluruh akun terdaftar di sistem Tapak., berikan hak akses Administrator studio, atau atur status verifikasi akun.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={fetchUsers}
            disabled={loading}
            className="px-3.5 py-2 rounded-[10px] text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Muat Ulang</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-[10px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Alert Notifications */}
      {successMessage && (
        <div className="p-4 rounded-[12px] bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-emerald-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {errorMessage && (
        <div className="p-4 rounded-[12px] bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-rose-800 animate-in fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Total Akun Terdaftar</span>
          <div className="text-2xl font-extrabold text-[#111827] mt-1">{stats.total} Akun</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Database PostgreSQL</span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Administrator Studio</span>
          <div className="text-2xl font-extrabold text-[#3D77EE] mt-1">{stats.adminCount} Admin</div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">
            Memiliki Akses /admin
          </span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Mitra Pemilik (Owner)</span>
          <div className="text-2xl font-extrabold text-purple-700 mt-1">{stats.ownerCount} Mitra</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Kelola Listing &amp; Iklan</span>
        </div>

        <div className="p-4 rounded-[16px] bg-white border border-[#E2E8F0] shadow-2xs">
          <span className="text-xs font-semibold text-[#687280]">Akun Terverifikasi</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1">
            {stats.verifiedCount} Akun
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Email &amp; Identitas Sah</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-[18px] p-4 sm:p-5 border border-[#E2E8F0] shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="flex items-center bg-slate-50 rounded-[10px] px-3.5 py-2 w-full sm:max-w-md border border-[#E2E8F0] focus-within:border-[#3D77EE] focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari berdasarkan nama, email, atau nomor HP..."
              className="bg-transparent border-none outline-none text-[#111827] placeholder:text-slate-400 text-xs sm:text-sm w-full"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: "ALL", label: "Semua Akun" },
              { id: "ADMIN", label: "Administrator" },
              { id: "OWNER", label: "Mitra Owner" },
              { id: "USER", label: "Pengguna" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRoleFilter(tab.id)}
                className={`px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedRoleFilter === tab.id
                    ? "bg-[#3D77EE] text-white shadow-2xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Pengguna</th>
                <th className="py-3 px-3">Hak Akses (Role)</th>
                <th className="py-3 px-3">Kontak</th>
                <th className="py-3 px-3">Verifikasi</th>
                <th className="py-3 px-3">Terdaftar</th>
                <th className="py-3 px-3 text-right">Aksi Manajemen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-[#3D77EE] border-t-transparent animate-spin" />
                      <span>Memuat data pengguna...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400">
                    Tidak ada akun yang sesuai dengan kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isSuperAdminUser = user.role === "SUPER_ADMIN";
                  const isAdminUser = user.role === "ADMIN";
                  const isPrimaryAdmin = user.email === "admin@admin.com";
                  const isRowLoading = actionLoadingId === user.id;

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Name & Email */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#3D77EE]/10 text-[#3D77EE] font-bold text-xs flex items-center justify-center shrink-0">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-[#111827] block truncate">
                              {user.name || "Tanpa Nama"}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate font-mono">
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-3.5 px-3">
                        {getRoleBadge(user.role)}
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-3">
                        {user.phone ? (
                          <span className="text-slate-700 font-mono flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{user.phone}</span>
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">-</span>
                        )}
                      </td>

                      {/* Verified Badge */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          disabled={isRowLoading || isPrimaryAdmin}
                          onClick={() => handleToggleVerify(user.id, user.is_verified)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10.5px] font-bold transition-colors cursor-pointer disabled:cursor-not-allowed ${
                            user.is_verified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                              : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                          }`}
                          title="Klik untuk ubah status verifikasi"
                        >
                          <CheckCircle2 className={`w-3 h-3 ${user.is_verified ? "text-emerald-600" : "text-slate-400"}`} />
                          <span>{user.is_verified ? "Terverifikasi" : "Belum Verifikasi"}</span>
                        </button>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-3 text-slate-500 whitespace-nowrap">
                        <span className="flex items-center gap-1 text-[11px]">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>{new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Tombol Pemberian / Pencabutan Akses Administrator */}
                          {isSuperAdminUser || isAdminUser ? (
                            !isPrimaryAdmin && (
                              <button
                                type="button"
                                disabled={isRowLoading}
                                onClick={() => handleUpdateRole(user.id, "OWNER")}
                                className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors cursor-pointer"
                                title="Cabut hak akses Administrator dan kembalikan ke Mitra Owner"
                              >
                                {isRowLoading ? "Memproses..." : "Cabut Admin"}
                              </button>
                            )
                          ) : (
                            <button
                              type="button"
                              disabled={isRowLoading}
                              onClick={() => handleUpdateRole(user.id, "ADMIN")}
                              className="px-2.5 py-1 rounded-[6px] text-[11px] font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors cursor-pointer shadow-2xs"
                              title="Berikan hak akses Administrator ke akun ini"
                            >
                              {isRowLoading ? "Memproses..." : "Beri Akses Admin"}
                            </button>
                          )}

                          {/* Tombol Hapus */}
                          {!isPrimaryAdmin && (
                            <button
                              type="button"
                              disabled={isRowLoading}
                              onClick={() => handleDeleteUser(user.id, user.email)}
                              className="p-1.5 rounded-[6px] text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Hapus akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-[20px] p-6 border border-[#E2E8F0] shadow-xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-[8px] bg-blue-50 text-[#3D77EE] flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#111827]">
                    Tambah Akun Baru
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Daftarkan pengguna &amp; tetapkan hak akses
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center bg-slate-50 rounded-[8px] px-3 py-2 border border-[#E2E8F0]">
                  <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="contoh: budi@gmail.com"
                    className="bg-transparent border-none outline-none text-xs w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Nama Lengkap
                </label>
                <div className="flex items-center bg-slate-50 rounded-[8px] px-3 py-2 border border-[#E2E8F0]">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Budi Santoso"
                    className="bg-transparent border-none outline-none text-xs w-full font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Nomor WhatsApp / HP
                </label>
                <div className="flex items-center bg-slate-50 rounded-[8px] px-3 py-2 border border-[#E2E8F0]">
                  <Phone className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="08123456789"
                    className="bg-transparent border-none outline-none text-xs w-full font-mono font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827] mb-1">
                  Tingkat Hak Akses (Role)
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-[8px] bg-slate-50 border border-[#E2E8F0] text-xs font-bold text-[#111827] focus:outline-none"
                >
                  <option value="ADMIN">Administrator Studio (Akses Penuh /admin)</option>
                  <option value="SUPER_ADMIN">Super Admin (Tingkat Tertinggi)</option>
                  <option value="OWNER">Mitra Owner (Portal Properti /owner)</option>
                  <option value="USER">Pengguna Umum (Pencari Hunian)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="newIsVerified"
                  checked={newIsVerified}
                  onChange={(e) => setNewIsVerified(e.target.checked)}
                  className="w-4 h-4 accent-[#3D77EE] rounded"
                />
                <label htmlFor="newIsVerified" className="text-xs font-semibold text-slate-700 cursor-pointer">
                  Tandai Akun Langsung Terverifikasi
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-[8px] text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={creatingUser}
                  className="px-5 py-2 rounded-[8px] text-xs font-bold text-white bg-[#3D77EE] hover:bg-[#2B55AB] transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  {creatingUser ? "Menyimpan..." : "Simpan & Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
