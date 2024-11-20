"use client"
import NavbarComponent from '@/components/navbar/NavbarComponent';
import Link from 'next/link';
import { useRef, useState } from 'react';
// import Reeact from './dashboard/page';
import Image from 'next/image';
import HeroComponent from '@/components/hero/HeroComponent';
import CardComponents from '@/components/card/CardComponents';
import { products } from '@/utils/data';


const Home = () =>{
  console.log(products)
//  const [counter, setCounter] = useState(0); 

//  const clickRef = useRef(0);
//  const handleClick = () => {
//   clickRef.current = clickRef.current + 1;
//   alert("you clicked" + clickRef.current + "times");
//  }
  return (

   <>
   <NavbarComponent/>
    <div className="h-[100%] w-[100%] items-center justify-center">
      <HeroComponent/>
      <div className="h-[100%] w-[100%] flex items-center justify-center p-5  flex-wrap gap-5">
        {products.map((product) =>(
          <CardComponents 
          key={product.id}
          image={product.image} 
          title={product.title} 
          category={product.category} 
          price={product.price}
          slug ={product.slug}
          />
        ))}
        {/* <CardComponents 
        image={"/shoes/img1.jpeg"} 
        title={'Air force one'} 
        category={"Men's shoe"} 
        price={300}
        />
         */}
        </div>
      </div>
   
   </>
    
  );
}
  export default Home;