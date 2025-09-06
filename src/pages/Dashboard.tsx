"use client"

import Header from "@/components/dashboard/Header";
import DoctorInfoCard from "@/components/dashboard/DoctorInfoCard";
import HeaderTemplateCard from "@/components/dashboard/HeaderTemplateCard";
import QuickStats from "@/components/dashboard/QuickStats";
import MainActions from "@/components/dashboard/MainActions";
import { useGlobalRefresh } from "@/hooks/useGlobalRefresh";

export default function EchocardiogramDashboard() {
  const doctorName = "Dra. Carolina Viña";
  const doctorEmail = "carolina.vina@hospital.com";
  
  const { registerCallbacks, refreshAll, isRefreshing } = useGlobalRefresh();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header 
        doctorName={doctorName} 
        doctorEmail={doctorEmail} 
        onRefreshAll={refreshAll}
        isRefreshing={isRefreshing}
      />
      <main className="p-6">
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DoctorInfoCard doctorName={doctorName} />
            <HeaderTemplateCard />
          </div>
        </div>
        <QuickStats registerRefreshCallback={registerCallbacks} />
        <MainActions registerRefreshCallback={registerCallbacks} />
      </main>
    </div>
  );
}
