"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RefreshCw } from "lucide-react";
import PaymentChannels from "./PaymentChannels";
import PaymentOrderSummary from "./PaymentOrderSummary";

interface PaymentContainerProps {
  initialPlanId?: string;
  initialBillingMode?: string;
}

interface OrderData {
  orderId: string;
  amount: number;
  paymentMethod: string;
  qrContent?: string;
  qrUrl?: string;
  vaNumber?: string;
  status: string;
}

export default function PaymentContainer({
  initialPlanId = "multi",
  initialBillingMode = "standard",
}: PaymentContainerProps) {
  const router = useRouter();
  const [planId] = useState(initialPlanId);
  const [billingMode] = useState(initialBillingMode);
  const [selectedChannel, setSelectedChannel] = useState<string>("qris");

  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSettled, setIsSettled] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Inisialisasi transaksi checkout dengan backend SNAP BI
  const initCheckout = useCallback(
    async (channel: string) => {
      setIsLoading(true);
      try {
        const res = await fetch("/api/payment/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            planId,
            billingMode,
            paymentMethod: channel.toUpperCase(),
            customerName: "Super Admin",
            customerPhone: "081234567890",
            userId: "admin@admin.com",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setOrderData({
              orderId: data.orderId,
              amount: data.amount,
              paymentMethod: data.paymentMethod,
              qrContent: data.qrContent,
              qrUrl: data.qrUrl,
              vaNumber: data.vaNumber,
              status: data.status,
            });
          }
        }
      } catch (err) {
        console.error("Failed to initialize checkout:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [planId, billingMode]
  );

  useEffect(() => {
    initCheckout(selectedChannel);
  }, [initCheckout, selectedChannel]);

  // Polling status transaksi pembayaran ke server setiap 3 detik
  useEffect(() => {
    if (!orderData?.orderId || isSettled) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?orderId=${orderData.orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === "SETTLED") {
            setIsSettled(true);
            setStatusMessage("Pembayaran Terverifikasi! Kuota Lapak Berhasil Aktif!");
            clearInterval(interval);

            // Redirect otomatis ke Dashboard Owner setelah verifikasi
            setTimeout(() => {
              router.push(`/owner/dashboard?payment=success&orderId=${orderData.orderId}`);
            }, 1800);
          }
        }
      } catch (err) {
        console.error("Error polling payment status:", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [orderData?.orderId, isSettled, router]);

  // Handler simulasi bayar lunas instan untuk sandbox
  const handleSimulateSuccess = async () => {
    if (!orderData?.orderId) return;
    try {
      const res = await fetch("/api/payment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderData.orderId }),
      });

      if (res.ok) {
        setIsSettled(true);
        setStatusMessage("Pembayaran Terverifikasi! Kuota Lapak Berhasil Aktif!");
        setTimeout(() => {
          router.push(`/owner/dashboard?payment=success&orderId=${orderData.orderId}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Simulation error:", err);
    }
  };

  const currentAmount = orderData?.amount || 220890;

  return (
    <div className="flex flex-col gap-6">
      {/* Banner Sukses Polling */}
      {statusMessage && (
        <div className="p-4 rounded-[14px] bg-emerald-600 text-white shadow-lg flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-white shrink-0" />
            <div>
              <h4 className="text-sm font-bold">{statusMessage}</h4>
              <p className="text-xs text-emerald-100">
                Mengalihkan Anda ke Dashboard Owner dalam hitungan detik...
              </p>
            </div>
          </div>
          <RefreshCw className="w-5 h-5 animate-spin text-white shrink-0" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Kolom Kiri: Kanal Pembayaran (7 cols ~ 58-60%) */}
        <div className="lg:col-span-7">
          <PaymentChannels
            amount={currentAmount}
            orderId={orderData?.orderId}
            qrContent={orderData?.qrContent}
            vaNumber={orderData?.vaNumber}
            selectedChannel={selectedChannel}
            onSelectChannel={(ch) => setSelectedChannel(ch)}
            onCheckStatus={() => {
              if (orderData?.orderId) {
                fetch(`/api/payment/status?orderId=${orderData.orderId}`)
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.status === "SETTLED") {
                      setIsSettled(true);
                      router.push(`/owner/dashboard?payment=success&orderId=${orderData.orderId}`);
                    } else {
                      alert(`Status pembayaran saat ini: ${data.status || "PENDING"}. Menunggu verifikasi dari bank/e-wallet.`);
                    }
                  });
              }
            }}
            onSimulateSuccess={handleSimulateSuccess}
            isLoading={isLoading}
          />
        </div>

        {/* Kolom Kanan: Ringkasan Pesanan (5 cols ~ 40%) */}
        <div className="lg:col-span-5">
          <PaymentOrderSummary planId={planId} billingMode={billingMode} />
        </div>
      </div>
    </div>
  );
}
