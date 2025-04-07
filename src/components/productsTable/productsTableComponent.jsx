import React from "react"
import { FaRegEye } from "react-icons/fa";
import { IoTrashBin } from "react-icons/io5";
import { FaPenToSquare } from "react-icons/fa6";
import Image from "next/image";
import AddProductComponent from "../addProduct/AddProductComponent";
import {useStoreForm} from '@/store/formVisible.store';

export default function ProductsTableComponent(){
  const {isFormVisible, openForm} = useStoreForm();
    return(
        <div className="flex flex-col gap-2 mt-2">
          <div className=" flex justify-between items-center gap-5 w-full">
 <h2 className="text-xl font-semibold text-cyan-900">Products table</h2> 
 <button onClick={()=>openForm()} className="px-5 py-2 bg-[#f80] text-white rounded-md" >
  Add New Product
  </button>
 </div>        
            {/* divider */}
            <div className="w-full h-0.5 bg-gray-200"></div>
      {/* divider */}
      <div className="flex flex-col w-full gap-5">
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="overflow-hidden rounded-sm">
            <Image
              src={"/nike/nike2.png"}
              width={80}
              height={50}
            />
          </div>
          <h3 className="font-bold">Nice Tshirt</h3>
          <h3 className=" text-gray-500 italic">Mens Tshirt</h3>
          <div className="bg-green-500 italic px-4 rounded-full">
            <h1 className="text-white">active</h1>
          </div>
          <div className="flex items-center gap-5">
            <FaRegEye size={20} className="text-green-600 cursor-pointer" />
            <FaPenToSquare size={20} className="text-blue-600 cursor-pointer" />
            <IoTrashBin size={20} className="text-red-600 cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="overflow-hidden rounded-sm">
            <Image
              src={"/nike/nike4.png"}
              width={80}
              height={50}
            />
          </div>
          <h3 className="font-bold">Nice Tshirt</h3>
          <h3 className=" text-gray-500 italic">Mens Tshirt</h3>
          <div className="bg-green-500 italic px-4 rounded-full">
            <h1 className="text-white">active</h1>
          </div>
          <div className="flex items-center gap-5">
            <FaRegEye size={20} className="text-green-600 cursor-pointer" />
            <FaPenToSquare size={20} className="text-blue-600 cursor-pointer" />
            <IoTrashBin size={20} className="text-red-600 cursor-pointer" />
          </div>
        </div>
        <div className="flex items-center justify-between gap-5 w-full">
          <div className="overflow-hidden rounded-sm">
            <Image
              src={"/nike/nike6.png"}
              width={80}
              height={50}
            />
          </div>
          <h3 className="font-bold">Nice Tshirt</h3>
          <h3 className=" text-gray-500 italic">Mens Tshirt</h3>
          <div className="bg-green-500 italic px-4 rounded-full">
            <h1 className="text-white">active</h1>
          </div>
          <div className="flex items-center gap-5">
            <FaRegEye size={20} className="text-green-600 cursor-pointer" />
            <FaPenToSquare size={20} className="text-blue-600 cursor-pointer" />
            <IoTrashBin size={20} className="text-red-600 cursor-pointer" />
          </div>
        </div>
            </div>
            {/* table */}
         {  isFormVisible && <AddProductComponent/>}
        </div>
    )
}