"use client"
import { notificationConfig } from '@/utils/constants';
import { redirect } from 'next/navigation';
 import React, {useState} from 'react';
 import { ToastContainer, toast } from 'react-toastify';

 const Page = () => {
  const adminCredentials = {
    email: "admin237@nike.com",
    password: "admin237"
  }

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    // CHECK if the user is an administrator
    if(email=== adminCredentials.email && password===adminCredentials.password){
      //if the user is an admin save the password and email in the local storage
      localStorage.setItem('admin' , JSON.stringify({email, password}));
      // send  a success notification
      toast.success("Welcome back " , notificationConfig);
      // redirect the user to the dashboard after 2 seconds
     setTimeout(() => redirect ('/admin/dashboard'), 2000)
    }else{
      toast.error('Invalid credentials', notificationConfig);
    }
  }
  

   return (
     <div className=' h-screen w-screen flex items-center justify-center bg-[#f80]'>
        <ToastContainer/>
        <div className='bg-white p-8 rounded-lg shadow-lg h-[350px] w-[400px] flex  flex-col items-center'>
            <h1 className='text-[30px] font-bold font-[cursive]'>SignIn</h1>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className='w-[90%] p-4 mt-4 rounded-md   border-2 border-gray-300 focus:outline-none' type="text" placeholder='Email' />
            <input  value={password} onChange={(e) => setPassword(e.target.value)} className='w-[90%] p-4 mt-4 rounded-md   border-2 border-gray-300 focus:outline-none' type="text" placeholder='Password' />
            <button onClick={()=>handleSubmit()} className='w-[90%] mt-8 p-4 rounded-md text-white bg-[#f80]  hover:bg-[#a87133]' type='submit'>
                Sign In 
            </button>
        </div>
     </div>
   )
 }
  export default Page;