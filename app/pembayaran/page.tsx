import React from "react";
import type { Metadata } from "next";
import PaymentHeader from "@/components/pembayaran/PaymentHeader";
import PaymentBreadcrumbAndTimer from "@/components/pembayaran/PaymentBreadcrumbAndTimer";
import PaymentContainer from "@/components/pembayaran/PaymentContainer";
import PaymentFooter from "@/components/pembayaran/PaymentFooter";

export const metadata: Metadata = {
  title: "Metode Pembayaran Sewa Lapak — Tapak.",
  description:
    "Pilih metode pembayaran aman dan instan untuk aktivasi kuota sewa lapak properti Tapak via QRIS, Virtual Account, dan E-Wallet.",
};

interface PaymentPageProps {
  searchParams: Promise<{
    plan?: string;
    billing?: string;
  }>;
}

export default async function PaymentPage({ searchParams }: PaymentPageProps) {
  const params = await searchParams;
  const planId = params.plan || "multi";
  const billingMode = params.billing || "standard";

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB] text-[#111827]">
      <PaymentHeader />
      <main className="w-full pt-20 sm:pt-24 bg-[#F3F6FB] flex-1 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <PaymentBreadcrumbAndTimer />
          <PaymentContainer
            initialPlanId={planId}
            initialBillingMode={billingMode}
          />
        </div>
      </main>
      <PaymentFooter />
    </div>
  );
}
