import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Pastikan akun super admin default selalu tersedia di database
async function ensureDefaultSuperAdmin() {
  try {
    const existing = await prisma.user.findUnique({
      where: { email: "admin@admin.com" },
    });
    if (!existing) {
      await prisma.user.create({
        data: {
          email: "admin@admin.com",
          name: "Super Admin",
          phone: "081234567890",
          role: "SUPER_ADMIN",
          is_verified: true,
        },
      });
    }
  } catch (err) {
    console.error("[USERS_API] Error ensuring default admin:", err);
  }
}

// GET: Ambil seluruh akun pengguna & status hak akses
export async function GET() {
  try {
    await ensureDefaultSuperAdmin();

    const users = await prisma.user.findMany({
      orderBy: { created_at: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        is_verified: true,
        created_at: true,
        updated_at: true,
      },
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    console.error("[USERS_API] GET error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil daftar akun pengguna." },
      { status: 500 }
    );
  }
}

// POST: Tambahkan akun baru langsung dari Super Admin Studio
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const role = typeof body.role === "string" ? body.role : "USER";
    const is_verified = Boolean(body.is_verified);

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Alamat email tidak valid." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: `Email ${email} sudah terdaftar di sistem.` },
        { status: 409 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        email,
        name: name || email.split("@")[0],
        phone: phone || null,
        role: role,
        is_verified,
      },
    });

    return NextResponse.json({
      success: true,
      user: newUser,
      message: `Akun ${email} berhasil didaftarkan sebagai ${role}.`,
    });
  } catch (error) {
    console.error("[USERS_API] POST error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal membuat akun baru." },
      { status: 500 }
    );
  }
}

// PATCH: Berikan / Cabut Hak Akses Administrator atau Ubah Status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    const newRole = body.role;
    const is_verified = body.is_verified;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID Pengguna wajib disertakan." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    // Proteksi akun super admin utama agar tidak terkunci
    if (targetUser.email === "admin@admin.com" && newRole && newRole !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Hak akses akun Super Admin Utama (admin@admin.com) tidak dapat diturunkan." },
        { status: 403 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (newRole !== undefined) updateData.role = newRole;
    if (is_verified !== undefined) updateData.is_verified = Boolean(is_verified);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Hak akses pengguna ${updatedUser.email} berhasil diperbarui menjadi ${updatedUser.role}.`,
    });
  } catch (error) {
    console.error("[USERS_API] PATCH error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memperbarui hak akses pengguna." },
      { status: 500 }
    );
  }
}

// DELETE: Hapus akun pengguna
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID Pengguna wajib disertakan." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Pengguna tidak ditemukan." },
        { status: 404 }
      );
    }

    if (targetUser.email === "admin@admin.com") {
      return NextResponse.json(
        { success: false, error: "Akun Super Admin Utama tidak dapat dihapus." },
        { status: 403 }
      );
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Akun ${targetUser.email} berhasil dihapus dari sistem.`,
    });
  } catch (error) {
    console.error("[USERS_API] DELETE error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal menghapus akun pengguna." },
      { status: 500 }
    );
  }
}
