"use client"
import Sidebar from "@/components/sidebar/Sidebar"
import SideNav from "@/components/SideNav/SideNav"
import React from "react"

export default function DashboardLayout({children}){
    return(
        <section className="w-full h-full flex">
            {/* left side of dashboard */}
            <Sidebar/>
            {/* right side of dashboard */}
            <div className="bg-white h-[100vh] w-3/4 p-5">
                <SideNav/>
              
                {children}
            </div>
        </section>
    )
}
