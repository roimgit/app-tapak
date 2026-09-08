"use client";

import React, { useState } from "react";
import PaymentChannels from "./PaymentChannels";
import PaymentOrderSummary from "./PaymentOrderSummary";

interface PaymentContainerProps {
  initialPlanId?: string;
  initialBillingMode?: string;
}

export default function PaymentContainer({
  initialPlanId = "multi",
  initialBillingMode = "standard",
}: PaymentContainerProps) {
  const [planId] = useState(initialPlanId);
  const [billingMode] = useState(initialBillingMode);

  // Hitung jumlah nominal untuk QRIS/Channels
  const getAmount = () => {
    const isHemat = billingMode === "hemat";
    if (planId === "single") {
      const base = isHemat ? 190000 : 75000;
      return base + Math.round(base * 0.11);
    }
    if (planId === "juragan") {
      const base = isHemat ? 1150000 : 450000;
      return base + Math.round(base * 0.11);
    }
    // Default multi
    return isHemat ? 499000 + Math.round(499000 * 0.11) : 220890;
  };

  const amount = getAmount();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Kolom Kiri: Kanal Pembayaran (7 cols ~ 58-60%) */}
      <div className="lg:col-span-7">
        <PaymentChannels amount={amount} />
      </div>

      {/* Kolom Kanan: Ringkasan Pesanan (5 cols ~ 40%) */}
      <div className="lg:col-span-5">
        <PaymentOrderSummary planId={planId} billingMode={billingMode} />
      </div>
    </div>
  );
}
