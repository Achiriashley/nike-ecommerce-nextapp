import Image from 'next/image'
import React from 'react'
import { IoIosTrash } from "react-icons/io";

export default function Minicart() {
  return (
<div className="bg-white h-[100%] w-[100%]    ">
      <div className=" h-[100%] w-[100%]   bg-white shadow-md rounded-lg  ">

<h3 className="text-black"> You have 3 items in cart</h3>
 
  <div className="flex items-center space-x-4 border-b bg-white pb-4">
    <Image src="/images/img3" alt="Dress" width={50}  height={50} class="w-16 h-16 rounded-lg"/>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-800">Girls Pink Moana Printed Dress</h3>
      <p className="text-sm text-gray-500">1 x <span className= "text-black font-bold">$80.00</span></p>
      <p className="text-sm text-gray-500">Size: S</p>
    </div>
    <button className="text-red-500 hover:text-red-700">
    <IoIosTrash   color="#f80"  size ={30}/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
     
    </button>
  </div>

  {/* Item 2 */}
  <div className="flex items-center space-x-4 bg-white border-b pb-4">
    <Image src="/images/img2" width={50}  height={50} alt="Bag" className="w-16 h-16 rounded-lg"/>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-800">Women Textured Handheld Bag</h3>
      <p className="text-sm text-gray-500">1 x <span className="text-black font-bold">$80.00</span></p>
      <p className="text-sm text-gray-500">Size: Regular</p>
    </div>
    <button className="text-red-500 hover:text-red-700">
    <IoIosTrash   color="#f80"  size ={30}/>   
         <path stroke-linecap="round"  stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      
    </button>
  </div>

  {/* Item 3 */}
  <div className="flex items-center space-x-4 bg-white border-b pb-4">
    <Image src="/images/img1" width={50}  height={50} alt="Shirt" className="w-16 h-16 rounded-lg"/>
    <div className="flex-1">
      <h3 className="text-sm font-medium text-gray-800">Tailored Cotton Casual Shirt</h3>
      <p className="text-sm text-gray-500">1 x <span className="text-black font-bold">$40.00</span></p>
      <p className="text-sm text-gray-500">Size: M</p>
    </div>
    <button className="text-red-500 hover:text-red-700">
    <IoIosTrash   color="#f80"  size ={30}/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </button>
  </div>
 {/* Subtotal */}
  <div className="flex justify-between items-center pt-4 border-t">
    <p className="text-sm font-semibold">Subtotal</p>
    <p className="text-lg font-bold">$200.00</p>
  </div>

   {/* Buttons*/}
  <div className="space-y-2">
    <button className="w-full py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
      View Cart
    </button>
    <button className="w-full py-2 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800">
      Checkout
    </button>
  </div>
</div>
 </div>
    
  )
}


