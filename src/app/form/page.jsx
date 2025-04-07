'use client'
import NavbarComponent from '@/components/navbar/NavbarComponent';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import { AiTwotoneCheckSquare } from "react-icons/ai";
import { GiHand } from "react-icons/gi";
import { useForm } from 'react-hook-form';

const Form = () => {
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  // Form submit handler
  const onSubmit = (data) => {
    console.log('Form Data:', data);
  };

  return ( 
    <div>
      <NavbarComponent />
      <div className="flex min-h-screen mt-12">
        
        {/* Left side (Image Section) */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center relative">
          <Image
            src="/nike/login.png"  
            alt="Login Image"
            className="w-full h-full object-cover"
            width={200}
            height={300}
          />

          {/* Overlay text */}
          <div className="absolute top-4 left-4 text-green-600 text-4xl font-extrabold">
            dorti
          </div>
        </div>

        {/* Right side (Login Form Section) */}
        <div className="w-1/2  mt-12 flex  justify-left bg-white">
          <div className="w-96 p-8 space-y-6 ">
            <div clasName="flex flex-col">
            <h2 className="text-3xl font-bold flex text-green-800"> Welcome < GiHand /></h2>
            <p className="text-gray-500">Please login here</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email address'
                    }
                  })}
                  className={`mt-1 p-3 w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={`mt-1 p-3 w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter your password"
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex justify-between mt-4">
                <Link href="#" className="text-sm flex items-center text-blue-500 hover:underline">
                  <AiTwotoneCheckSquare /> remember me
                </Link>
                <Link href="#" className="text-sm text-blue-500 hover:underline">Forgot Password?</Link>
              </div>

              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
