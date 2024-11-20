'use client'
import { IoHeartOutline } from "react-icons/io5";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import React, { useState } from "react";
import Image from "next/image"; 
import { products } from "@/utils/data";

export default function ProductPage({ params }) { 
  const { slug } =React.use(params); 
  const mainProduct = products.find(product => product.slug===slug);
  console.log('main product:',mainProduct)
  const [bigImage, setBigImage] = useState(mainProduct.image)
 

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
          <h1 className="text-3xl font-bold">{mainProduct.title}</h1>
          <p className="text-gray-600">{mainProduct?.description}</p> 
          <p className="text-xl font-semibold">{mainProduct.price}</p>
          <button className="w-full py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
            Add to Cart
          </button>
          <button className="flex w-full py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400 items-center justify-center">
            Add to Favorite
            <IoHeartOutline className="w-5 h-5 ml-2" /> 
          </button>
        </div>
      </div>
    </div>
  );
}
