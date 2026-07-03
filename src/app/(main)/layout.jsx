"use client";

import React from "react";
import Navbar from "../../components/Shared/Navbar/Navbar";
import Footer from "../../components/Shared/Footer/Footer";
import ScrollUp from "../../components/Shared/ScrollUp/ScrollUp";
import DarkAndLightToggle from "../../components/Shared/DarkLightToogle/DarkAndLightToggle";

export default function MainLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="main">
        {children}
      </main>
      <ScrollUp />
      <DarkAndLightToggle />
      <Footer />
    </div>
  );
}
