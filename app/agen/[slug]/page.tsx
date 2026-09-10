import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgentStorefrontClient from "@/components/agent/AgentStorefrontClient";
import { getAgentBySlug } from "@/lib/agents";

interface AgentPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: AgentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getAgentBySlug(slug);

  if (!data) {
    return {
      title: "Agen Properti Tidak Ditemukan — Tapak.",
    };
  }

  const { agent } = data;
  return {
    title: `${agent.name} — Etalase Agen Properti Terverifikasi Tapak.`,
    description: `Lihat katalog listing hunian dan properti terverifikasi milik ${agent.name} (${agent.agency}). Hubungi agen terlisensi resmi Tapak sekarang.`,
  };
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { slug } = await params;
  const data = await getAgentBySlug(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F6FB]">
      <Navbar />
      <main className="flex-1">
        <AgentStorefrontClient
          agent={data.agent}
          initialListings={data.listings}
        />
      </main>
      <Footer />
    </div>
  );
}
