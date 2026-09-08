import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nicepaySnapService } from "@/modules/payment/nicepay-snap.service";

interface PlanMeta {
  name: string;
  quota: number;
  days: number;
  totalAmount: number;
}

function calculatePlanDetails(planId: string, billingMode: string): PlanMeta {
  const isHemat = billingMode === "hemat";

  if (planId === "single") {
    const base = isHemat ? 190000 : 75000;
    const tax = Math.round(base * 0.11);
    return {
      name: "Single Lapak",
      quota: 1,
      days: isHemat ? 90 : 30,
      totalAmount: base + tax,
    };
  }

  if (planId === "juragan") {
    const base = isHemat ? 1150000 : 450000;
    const tax = Math.round(base * 0.11);
    return {
      name: "Juragan Properti",
      quota: 15,
      days: isHemat ? 180 : 90,
      totalAmount: base + tax,
    };
  }

  // Default: multi
  const base = isHemat ? 499000 : 199000;
  const tax = isHemat ? Math.round(base * 0.11) : 21890;
  return {
    name: "Multi Lapak",
    quota: 5,
    days: isHemat ? 90 : 60,
    totalAmount: isHemat ? base + tax : 220890,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      planId = "multi",
      billingMode = "standard",
      paymentMethod = "QRIS",
      customerName = "Pemilik Properti Tapak",
      customerPhone = "081234567890",
      userId = "owner_demo",
    } = body;

    const plan = calculatePlanDetails(planId, billingMode);
    const orderId = `INV-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    let qrContent: string | null = null;
    let qrUrl: string | null = null;
    let vaNumber: string | null = null;
    let referenceNo: string = `REF-${Date.now()}`;
    let expiredAt: string = new Date(Date.now() + 1440 * 60000).toISOString();

    if (paymentMethod.toUpperCase() === "QRIS") {
      const qrisResult = await nicepaySnapService.generateQRIS({
        orderId,
        amount: plan.totalAmount,
        customerName,
        customerPhone,
        packageName: plan.name,
      });

      qrContent = qrisResult.qrContent;
      qrUrl = qrisResult.qrUrl || null;
      referenceNo = qrisResult.referenceNo;
      expiredAt = qrisResult.expiredAt;
    } else if (paymentMethod.toUpperCase().startsWith("VA_") || paymentMethod.includes("_va")) {
      const bankCode = paymentMethod.replace("VA_", "").replace("_va", "").toUpperCase();
      const vaResult = await nicepaySnapService.createVirtualAccount({
        orderId,
        amount: plan.totalAmount,
        bankCode: bankCode || "BCA",
        customerName,
        customerPhone,
      });

      vaNumber = vaResult.vaNumber;
      referenceNo = vaResult.referenceNo;
      expiredAt = vaResult.expiredAt;
    } else {
      // E-Wallet (GoPay, ShopeePay) fallback via QRIS/Direct Link
      const qrisResult = await nicepaySnapService.generateQRIS({
        orderId,
        amount: plan.totalAmount,
        customerName,
        customerPhone,
        packageName: `${plan.name} (${paymentMethod})`,
      });

      qrContent = qrisResult.qrContent;
      qrUrl = qrisResult.qrUrl || null;
      referenceNo = qrisResult.referenceNo;
      expiredAt = qrisResult.expiredAt;
    }

    // Simpan ke database Prisma
    const payment = await prisma.payment.create({
      data: {
        user_id: userId,
        order_id: orderId,
        amount: plan.totalAmount,
        payment_method: paymentMethod.toUpperCase(),
        reference_no: referenceNo,
        qr_content: qrContent,
        qr_url: qrUrl,
        va_number: vaNumber,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      orderId: payment.order_id,
      amount: plan.totalAmount,
      packageName: plan.name,
      quotaTotal: plan.quota,
      durationDays: plan.days,
      paymentMethod: payment.payment_method,
      referenceNo: payment.reference_no,
      qrContent: payment.qr_content,
      qrUrl: payment.qr_url,
      vaNumber: payment.va_number,
      expiredAt,
      status: payment.status,
    });
  } catch (error) {
    console.error("Payment checkout error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat transaksi pembayaran NICEPAY SNAP.",
      },
      { status: 500 }
    );
  }
}
