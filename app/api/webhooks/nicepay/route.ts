import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nicepaySnapService } from "@/modules/payment/nicepay-snap.service";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const signature = req.headers.get("x-signature") || "";
    const timestamp = req.headers.get("x-timestamp") || "";

    // 1. Verifikasi signature SNAP BI
    const isValidSignature = nicepaySnapService.verifyWebhookSignature(
      "POST",
      "/api/webhooks/nicepay",
      signature,
      rawBody,
      timestamp
    );

    if (!isValidSignature && process.env.NICEPAY_ENV === "production") {
      console.warn("NICEPAY Webhook: Invalid SNAP signature received.");
      return NextResponse.json(
        {
          responseCode: "4012500",
          responseMessage: "Unauthorized Signature",
        },
        { status: 401 }
      );
    }

    // 2. Ekstraksi identifier transaksi dari payload SNAP
    const orderId =
      rawBody.partnerReferenceNo ||
      rawBody.originalPartnerReferenceNo ||
      rawBody.trxId ||
      rawBody.orderId;

    const statusCode =
      rawBody.latestTransactionStatus ||
      rawBody.resultCd ||
      rawBody.status ||
      "";

    if (!orderId) {
      return NextResponse.json(
        {
          responseCode: "4002500",
          responseMessage: "Missing Partner Reference No",
        },
        { status: 400 }
      );
    }

    // Cari payment di database
    const payment = await prisma.payment.findUnique({
      where: { order_id: orderId },
    });

    if (!payment) {
      return NextResponse.json(
        {
          responseCode: "4042500",
          responseMessage: "Payment record not found",
        },
        { status: 404 }
      );
    }

    // 3. Evaluasi status pembayaran sukses
    const isSuccess =
      statusCode === "00" ||
      statusCode === "SUCCESS" ||
      statusCode === "SETTLED" ||
      statusCode === "2002500" ||
      rawBody.status === "SETTLED";

    if (isSuccess && payment.status !== "SETTLED") {
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

      // Buat / perbarui subscription aktif untuk user
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
      await prisma.payment.update({
        where: { order_id: orderId },
        data: {
          status: "SETTLED",
          subscription_id: subscription.id,
          reference_no:
            rawBody.referenceNo || rawBody.originalReferenceNo || payment.reference_no,
        },
      });
    }

    // 4. Return response JSON standar SNAP BI
    return NextResponse.json({
      responseCode: "2002500",
      responseMessage: "Success",
    });
  } catch (error) {
    console.error("NICEPAY Webhook handling error:", error);
    return NextResponse.json(
      {
        responseCode: "5002500",
        responseMessage: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
