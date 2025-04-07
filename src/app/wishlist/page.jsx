'use client'

import NavbarComponent from '@/components/navbar/NavbarComponent';
import { useStoreFavorite } from '@/store/favorite.store';
import { products } from '@/utils/data';
import React from 'react'

const Page = () => {
   const { selectedHeartIds, clearFavorite } = useStoreFavorite();
    
   // Filter products based on selected IDs
   const cartFavorites = products.filter((product) =>
     selectedHeartIds.includes(product.id)
   );
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Navbar */}
      <NavbarComponent />

      {/* Cart Content */}
      <div className="container mx-auto mt-12 py-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Your Favorites
        </h1>

        {/* Clear Cart Button */}
        {cartFavorites.length > 0 && (
          <div className="text-center mb-6">
            <button
              onClick={()=>clearFavorite()}
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Cart Items */}
        {cartFavorites.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Your cart is empty. Add some favorites!
          </p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartFavorites.map((product) => (
              <li
                key={product.id}
                className="bg-white shadow-md rounded-lg p-4 hover:shadow-lg transition"
              >
                {/* Product Image */}
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />

                {/* Product Info */}
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">
                    {product.description}
                  </p>
                  <p className="text-gray-800 font-bold mt-2">
                    ${product.price}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Page