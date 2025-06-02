import React, { useState } from "react";
import DashboardLayout from "../components/common/DashboardLayout";
import DashboardBrandingCard from "../partials/dashboard/DashboardBrandingCard";
import AnimalCard from "../partials/dashboard/AnimalCard";
import StockCard from "../partials/dashboard/StockCard";
import FlockCard from "../partials/dashboard/FlockCard";


function Dashboard() {

  return (
    <DashboardLayout>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <DashboardBrandingCard />
        </div>
        <StockCard />
        <FlockCard />
        <AnimalCard />

      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
