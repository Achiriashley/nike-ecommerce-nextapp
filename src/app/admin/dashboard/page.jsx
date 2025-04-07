"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/sidebar/Sidebar";
import SideNav from "@/components/sideNav/SideNav";
import Image from "next/image";
import ProductsTableComponent from "@/components/productsTable/productsTableComponent";

export default function Page() {
  return (
    <div className="flex flex-col gap-5 mt-5">
      <h1 className="text-3xl font-bold text-[#f80]">Dashboard</h1>
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold text-cyan-900">
          Welcome back, Admin
        </h2>
        <p className="text-gray-500">
          Here is a summary of your recent activity.
        </p>
      </div>
      {/* Best seller products */}
      <div className="flex flex-wrap gap-5  items-center">
        <div className="flex-col">
          {/* image container */}
          <div className="overflow-hidden rounded-lg">
            <Image
              src={"/nike/nike1.png"}
              width={200}
              height={400}
            />
          </div>
          <h3 className="text-black">Nice Tshirt</h3>
          <p className="text-[#f80] font-bold">$150.00</p>
        </div>
        <div className="flex-col">
          {/* image container */}
          <div className="overflow-hidden rounded-lg">
            <Image
              src={"/nike/nike2.png"}
              width={200}
              height={400}
            />
          </div>
          <h3 className="text-black">Long nike pull</h3>
          <p className="text-[#f80] font-bold">$250.00</p>
        </div>
        <div className="flex-col">
          {/* image container */}
          <div className="overflow-hidden rounded-lg">
            <Image
              src={"/nike/nike3.png"}
              width={200}
              height={400}
            />
          </div>
          <h3 className="text-black">Addidas Tshirt</h3>
          <p className="text-[#f80] font-bold">$300.00</p>
        </div>
      </div>
     
      {/* divider */}
     <ProductsTableComponent/>
      </div>
    
  );
}
  