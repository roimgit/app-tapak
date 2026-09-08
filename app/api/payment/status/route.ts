import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId diperlukan" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
      include: { subscription: true },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: payment.order_id,
      status: payment.status,
      amount: Number(payment.amount),
      paymentMethod: payment.payment_method,
      subscriptionId: payment.subscription_id,
      subscription: payment.subscription,
    });
  } catch (error) {
    console.error("Payment status check error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal memeriksa status pembayaran" },
      { status: 500 }
    );
  }
}

// Endpoint simulasi sandbox untuk pengujian developer
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "orderId diperlukan" },
        { status: 400 }
      );
    }

    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, message: "Transaksi tidak ditemukan" },
        { status: 404 }
      );
    }

    // Tentukan kuota dan masa aktif berdasarkan nominal
    const amount = Number(payment.amount);
    let quota = 5;
    let packageName = "Multi Lapak";
    let durationDays = 60;

    if (amount <= 90000 || amount === 210900) {
      quota = 1;
      packageName = "Single Lapak";
      durationDays = amount === 210900 ? 90 : 30;
    } else if (amount >= 400000 && amount !== 553890) {
      quota = 15;
      packageName = "Juragan Properti";
      durationDays = amount >= 1000000 ? 180 : 90;
    } else if (amount === 553890) {
      quota = 5;
      packageName = "Multi Lapak (Hemat 3 Bulan)";
      durationDays = 90;
    }

    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + durationDays * 24 * 3600 * 1000);

    // Buat subscription
    const subscription = await prisma.subscription.create({
      data: {
        user_id: payment.user_id,
        package_name: packageName,
        quota_total: quota,
        quota_used: 0,
        start_date: startDate,
        end_date: endDate,
        is_active: true,
      },
    });

    // Update status payment menjadi SETTLED
    const updatedPayment = await prisma.payment.update({
      where: { order_id: orderId },
      data: {
        status: "SETTLED",
        subscription_id: subscription.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Simulasi pembayaran berhasil diselesaikan.",
      orderId: updatedPayment.order_id,
      status: updatedPayment.status,
      subscription,
    });
  } catch (error) {
    console.error("Simulation settlement error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal simulasi penyelesaian pembayaran" },
      { status: 500 }
    );
  }
}
