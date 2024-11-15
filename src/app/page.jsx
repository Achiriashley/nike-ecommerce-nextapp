"use client"
import NavbarComponent from '@/components/navbar/NavbarComponent';
import Link from 'next/link';
import { useRef, useState } from 'react';
// import Reeact from './dashboard/page';
import { Image } from 'next/image';

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
    <div className="h-[100vh] w-[100%] items-center justify-center">
      <div>
       <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJCu-bB3GriO126kr58X9_8VN9WIrmFrrmpQ&s" alt=""  className="w-[100%] h-[100%]"/>
       <img 
    src="shoe.png" 
    alt="Overlay" 
    class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] object-cover  shadow-lg"
  />
      </div>
    </div>
   </>
    
  );
}
  export default Home;