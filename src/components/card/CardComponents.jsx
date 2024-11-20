import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { IoHeartOutline } from "react-icons/io5";

 export default function CardComponents({image,title,category,price,slug}) {
  return (
    
     <div className="h-[500px] w-[400px]  cursor-pointer mb-5 flex flex-col gap-3 rounded overflow-hidden">
<div className="absolute top-3 right-3 z-10">
        <button className="text-gray-400 hover:text-red-500 focus:outline-none">
<IoHeartOutline  className="w-6 h-6" /> {/* React Icon */}
        </button>
       </div>
           <div className="h-[300px] relative w-[100%] overflow-hidden">
           <Link
              href={`/products/${slug}`}>
             <Image
            // src={"/shoes/img1.jpeg"} 
            src={image}
            fill
            objectFit="cover"
            Object="center"
            alt=""
            />
            </Link>
            <IoHeartOutline  className=" absolute top-3 right-3 "color="#f80"  size ={30}/>
          </div>

          <div className="p-3">
             <h1> {title}</h1>
             <p> {category}</p>
             <h1>{price}</h1>
            
              <button className="w-[100%] p-3 bg-[#f80] rounded mt-2 focus:bg-amber-950 ">Add to Cart</button>
              
         </div>
         </div>

   )
 }

