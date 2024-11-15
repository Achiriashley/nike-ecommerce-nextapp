"use client"
import NavbarComponent from '@/components/navbar/NavbarComponent';
import Link from 'next/link';
import { useRef, useState } from 'react';
// import Reeact from './dashboard/page';
import Image from 'next/image';

import HeroComponent from '@/components/hero/HeroComponent';
import CardComponents from '@/components/card/CardComponents';

const Home = () =>{
 const [counter, setCounter] = useState(0); 

 const clickRef = useRef(0);
 const handleClick = () => {
  clickRef.current = clickRef.current + 1;
  alert("you clicked" + clickRef.current + "times");
 }
  return (

   <>
   <NavbarComponent/>
    <div className="h-[100%] w-[100%] items-center justify-center">
      <HeroComponent/>
      <div className="h-[100%] w-[100%] flex items-center justify-center p-5  flex-wrap gap-5">
        <CardComponents/>
        <CardComponents/>
        <CardComponents/>
        <CardComponents/>
        <CardComponents/>
        </div>
      </div>
   
   </>
    
  );
}
  export default Home;