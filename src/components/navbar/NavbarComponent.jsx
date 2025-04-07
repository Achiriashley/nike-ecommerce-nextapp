'use client'
import Link from "next/link";

import React from "react";
import { IoBagHandleOutline,  IoHeartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import Image from "next/image";
import  { useState } from "react";
import Minicart from "../minicart/Minicart";
import { useStoreFavorite } from "@/store/favorite.store";
import { useStoreCart } from '@/store/cart.store';
import { UserButton } from "@clerk/nextjs";

export default function NavbarComponent( ) {

  const{selectedHeartIds} = useStoreFavorite();
  const{selectedIds} = useStoreCart();
  const favoriteSize = selectedHeartIds.length;
  const cartSize = selectedIds.length;

  return (
    <div className="h-[50px] bg-black text-white flex w-[100%]  items-center justify-between p-4 fixed  top-0 z-50 ">
 <Link href="/">
      <Image src={'/logo.png'} width={70} height={70} alt='logo'/>
      </Link> 
      <div className=" flex gap-5 " >
        <Link href="#">New</Link>
        <Link href="#">Men</Link>
        <Link href="#">Women</Link>
        <Link href="#">Kids</Link>
        <Link href="#">Best Sellers</Link>
      </div>
      <div className="flex gap-5 cursor-pointer">
        <UserButton/>
        <div className="relative">
          <IoBagHandleOutline color="#f80" size={30} />
          <Link
            href={"/cart"}
            className="h-[20px] w-[20px] bg-[#f80] rounded-full absolute bottom-[-5px] transition-transform duration-300 ease-in-out delay-300 flex items-center justify-center text-[15px] right-[-5px] font-bold hover:h-96 hover:w-96 hover:rounded-md hover:top-7"
          >
            {cartSize}
          </Link>
        </div>

        <Link href={"/wishlist"}
         className="relative"
         >
          <IoHeartOutline color="#f80" size={30} />
          <div className="h-[20px] w-[20px] bg-[#f80] rounded-full absolute bottom-[-5px] flex items-center justify-center text-[15px] right-[-5px] font-bold">
            {favoriteSize}
          </div>
        </Link>
      </div>
    </div>
  );
}
