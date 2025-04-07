'use client';

import NavbarComponent from '@/components/navbar/NavbarComponent';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Notyf } from 'notyf';

export default function Registration() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log('Form Data:', data);
    // Form submission logic here
  };
 
  return (
    <div>
      <NavbarComponent />
      <div className="flex min-h-screen mt-12">
        {/* Left Section */}
        <div className="w-1/2 bg-gray-100 flex items-center justify-center relative">
          <Image
            src="/nike/login.png"
            alt="Login Image"
            className="w-full h-full object-cover"
            width={200}
            height={300}
          />
          <div className="absolute top-4 left-4 text-green-600 text-4xl font-extrabold">
            dorti
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex mt-12 justify-left bg-white">
          <div className="w-96 p-8 space-y-6">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-green-500">
                Create New Account
              </h2>
              <p className="text-gray-500">Please enter details</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* First Name */}
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', {
                    required: 'First name is required',
                    maxLength: {
                      value: 20,
                      message: 'First name must be less than 20 characters',
                    },
                  })}
                  className={`mt-1 p-3 w-full border ${
                    errors.firstName
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.firstName
                      ? 'focus:ring-red-500'
                      : 'focus:ring-green-600'
                  }`}
                  placeholder="Enter your first name"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', {
                    required: 'Last name is required',
                  })}
                  className={`mt-1 p-3 w-full border ${
                    errors.lastName
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.lastName
                      ? 'focus:ring-red-500'
                      : 'focus:ring-green-600'
                  }`}
                  placeholder="Enter your last name"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: 'Invalid email format',
                    },
                  })}
                  className={`mt-1 p-3 w-full border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'focus:ring-red-500'
                      : 'focus:ring-green-600'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*\d).+$/,
                      message:
                        'Password must contain at least one uppercase letter and one number',
                    },
                  })}
                  className={`mt-1 p-3 w-full border ${
                    errors.password
                      ? 'border-red-500'
                      : 'border-gray-300'
                  } rounded-md shadow-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? 'focus:ring-red-500'
                      : 'focus:ring-green-600'
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="terms"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions',
                  })}
                />
                <label htmlFor="terms" className="text-sm text-gray-700">
                  I agree to the Terms & Conditions
                </label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.terms.message}
                </p>
              )}

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white p-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none"
                >
                  Signup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
