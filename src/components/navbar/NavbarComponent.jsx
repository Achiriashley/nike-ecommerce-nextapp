import Link from "next/link";
import React from "react";
import { IoBagHandleOutline,  IoHeartOutline } from "react-icons/io5";
import { FaRegHeart } from "react-icons/fa";
import Image from "next/image";

export default function NavbarComponent() {
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
      <div className="flex gap-5  cursor-pointer">
        <IoBagHandleOutline color="#f80"  size={30}
        
         />
        <IoHeartOutline color="#f80"  size={30}/>
      </div>
    </div>
  );
}
