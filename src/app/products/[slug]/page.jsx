'use client'
import { IoHeartOutline, IoHeart } from "react-icons/io5";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import React, { useState } from "react";
import Image from "next/image"; 
import { products } from "@/utils/data";
import { useStoreCart } from "@/store/cart.store";
import { useStoreFavorite } from "@/store/favorite.store";
import { useQuery } from '@tanstack/react-query';

export default function ProductPage({ params }) { 
  const { slug } = React.use(params); 

  const { isPending, error, data } = useQuery({
      queryKey: ['getProducts'],
      queryFn: () =>
        fetch('http://localhost:3000/api/products').then((res) =>
          res.json()
    ),
    });
  
    console.log('product', data);



  const mainProduct = data?.find(product => product.slug===slug);
  console.log('main product:',mainProduct)
  const [bigImage, setBigImage] = useState(mainProduct?.image)

  const {selectedIds, toggleId} = useStoreCart();
  const{selectedHeartIds, toggleHeartIconId} = useStoreFavorite();
  const product = {
    name: "Nike Air Max",
    description: "A premium quality shoe for your everyday and sportswear.",
    price: "$120",
    images: [
      "/nike/nike1.png",
      "/nike/nike2.png",
      "/nike/nike3.png",
      "/nike/nike4.png",
      "/nike/nike6.png",
      "/nike/nike7.png",
      "/nike/nike9.png",
    ],
  };

  return (
    <div>
      <NavbarComponent />
      <div className="flex gap-5 p-5 justify-center">
      
        <div className="w-[10%]  flex flex-col gap-3">
          {product.images.map((image, index) => (
            <Image

              key={index} 
              src={image} 
              alt={`Product ${index + 1}`} 
              width={100} 
              height={100} 
              onMouseOver={() => setBigImage(image)}
              className="w-full h-auto rounded-md object-cover cursor-pointer" 
            />
          ))}
        </div>

        {/* Main Image */}
        <div className="w-2/4">
          <Image
            src={bigImage} 
            alt="Main Product" 
            width={500} 
            height={500} 
            className="w-full h-auto rounded-md object-cover" 
          />
        </div>

        {/* Product Details */}
        <div className="w-1/4 flex flex-col gap-3 lg:sticky mt-28">
          <h1 className="text-3xl font-bold">{mainProduct?.title}</h1>
          <p className="text-gray-600">{mainProduct?.description}</p> 
          <p className="text-xl font-semibold">{mainProduct?.price}</p>
        
          {/* Add to Cart Button */}
          <button
            onClick={() => toggleId(mainProduct.id)}
            className={`w-full py-2 ${
              selectedIds.includes(mainProduct.id)
                ? "bg-blue-950"
                : "bg-[#f80]"
            } text-white rounded-md hover:bg-orange-600`}
          >
            {selectedIds.includes(mainProduct.id)
              ? "Remove from Cart"
              : "Add to Cart"}
          </button>

          {/* Add to Favorite Button with Icon */}
          <button
            onClick={() => toggleHeartIconId(mainProduct.id)}
            className={'flex w-full py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 items-center justify-center'}
          >
            {selectedHeartIds.includes(mainProduct.id)
              ? "Remove from Favorite"
              : "Add to Favorite"}
            {selectedHeartIds.includes(mainProduct.id) ? (
              <IoHeart className="w-5 h-5 ml-2" color="#f80" size={30} />
            ) : (
              <IoHeartOutline className="w-5 h-5 ml-2" />
            )}
          </button>




          
        </div>
      </div>
    </div>
  );
}
