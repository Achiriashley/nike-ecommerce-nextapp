'use client'
import React, { useState } from "react";

import Image from "next/image";
import { IoIosTrash } from "react-icons/io";
import NavbarComponent from "@/components/navbar/NavbarComponent";
import { useStoreCart } from "@/store/cart.store";
import { products } from "@/utils/data";
import { createCoinBasePaymentCharge } from "../api/payment/route";
import axios from "axios";
import { makePayment } from "@/utils/helpers";

export default function Page() {
  const { selectedIds, removeItem } = useStoreCart();

  // const [subTotal, setSubTotal] = useState(0);

  // Filter products based on selected IDs
  const cartItems = products.filter((product) =>
    selectedIds.includes(product.id)
  );

  let subTotal = 0;
  cartItems?.forEach((product) => (subTotal += product.price));

  const noItemsPresent = () => {
    return (
      <div className="container pt-80">
        <p className="text-center text-[#f80] text-lg">
          Your cart is empty. Add some products!
        </p>
      </div>
    );
  };
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mobilePaymentUrl, setMobilePaymentUrl] = useState(null);
  
  
   

  const config = {
    headers: {
      "X-CC-Api-Key": process.env.NEXT_PUBLIC_COINBASE_API_KEY,
    },
  };
  
  const payWithCrypto = async (amount, currency) => {
    setIsLoading(true);
      const data = {
        local_price: {
          amount,
          currency,
        },
        description: "Payment for a product",
        pricing_type: "fixed_price",
      };
    await axios
      .post("https://api.commerce.coinbase.com/charges", data, config)
      .then((response) => {
        setPaymentUrl(response.data.data.hosted_url);
        console.log('hosted URl', response.data.data.hosted_url);
        setIsLoading(false);
      }).catch((error) => {
        setIsLoading(false);
        console.error("error from fronted func:", error);
      })
  }

  return (
    <div>
      <NavbarComponent />
      {cartItems.length == 0 ? (
        noItemsPresent()
      ) : (
        <div className="h-[100%] w-[100%] bg-white dark:bg-slate-900 shadow-md rounded-lg pt-28 p-6">
          <h3 className="text-black  mb-4">
            You have {cartItems.length} items in your cart
          </h3>

          {/* Item 1 */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center space-x-4 border-b pb-4"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={50}
                height={50}
                className="w-16 h-16 rounded-lg"
              />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-800">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500">
                  1 x{" "}
                  <span className="text-black font-bold">${item.price}</span>
                </p>
                <p className="text-sm text-gray-500">Size: Regular</p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700"
              >
                <IoIosTrash color="#f80" size={30} />
              </button>
            </div>
          ))}

          {/* Subtotal */}
          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm font-semibold text-black">Subtotal</p>
            <p className=" font-bold text-[#f80] text-2xl">${subTotal}</p>
          </div>

          {/* Buttons */}
          <div className="space-y-2 mt-4">
            {!paymentUrl && (
              <button
                onClick={() => payWithCrypto(subTotal, "XAF")}
                className="w-full font-bold py-2 text-lg text-white bg-[#014CEC] rounded-lg"
              >
                {isLoading ? "Processing..." : "Pay with Crypto"}
              </button>
            )}
            {paymentUrl && (
              <a href={paymentUrl} target="_blank">
                <button className="w-full font-bold py-2 text-lg text-white bg-[#22a133] rounded-lg">
                  Validate payment
                </button>
              </a>
            )}
            {
              !mobilePaymentUrl && 
              <button onClick={() =>{makePayment(cartItems,subTotal).then(data=>{ console.log('gotten:',data); setMobilePaymentUrl(data)}) } } className="w-full py-2 text-lg font-bold text-white bg-amber-700 rounded-lg ">
              Pay with Mobile Payments
            </button>
            }
            
           
            {mobilePaymentUrl && (
              <a href={mobilePaymentUrl} target="_blank">
                <button className="w-full font-bold py-2 text-lg text-white bg-[#22a133] rounded-lg" > 
                  Validate Mobile Payment
                </button>
              </a>
            )

            }
          </div>
        </div>
      )}
    </div>
  );
}