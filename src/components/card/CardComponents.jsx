import Image from 'next/image'
import Link from 'next/link';
import React from 'react'
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from './../../store/favorite.store';

  
 export default function CardComponents({id,image,title,category,price,slug}) {
        const{selectedHeartIds, toggleHeartIconId} = useStoreFavorite();
        // filter products based on selected ids
        const {selectedIds, toggleId} = useStoreCart();
  return (
    
     <div className="h-[300px] w-[200px]  cursor-pointer mb-5 flex flex-col gap-3 rounded overflow-hidden">
<div className="absolute top-3 right-3 z-10">
        <button className="text-gray-400 hover:text-red-500 focus:outline-none">
<IoHeartOutline  className="w-6 h-6" /> {/* React Icon */}
        </button>
       </div>
           <div className="h-[300px] relative w-[100%] overflow-hidden">
           <Link
              href={`/products/${slug}`} className="relative block h-[100%]">
             <Image
            
            src={image}
            fill
            objectFit="cover"
            Object="center"
            alt=""
              className="object-cover"
            />
            </Link>
            {selectedHeartIds.includes(id)? (
                <IoHeart 
                onClick={() => toggleHeartIconId(id)}
                className = "absolute top-3 right-3"
                color = "#f80"
                size ={30} />
            ):(
            <IoHeartOutline 
             className=" absolute top-3 right-3 " 
             color="#f80" 
              size ={30}
              onClick = {() => toggleHeartIconId(id)}  />
            )}
            
          </div>

          <div className="p-3">
             <h1> {title}</h1>
             <p> {category}</p>
             <h1>${price}</h1>
            
              <button 
              className={`w-[100%] p-3 ${selectedIds.includes(id) ? "bg-[#0f3] " : "bg-[#f80]"  } 
              rounded mt-2 focus:bg-amber-600`}

              onClick={() => toggleId(id)}
              >

                {selectedIds.includes(id) ? "Remove from Cart " : "Add to Cart "}
              </button>
              
         </div>
         </div>

   )
 }

