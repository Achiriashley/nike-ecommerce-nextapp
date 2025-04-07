// "use client"
// import NavbarComponent from '@/components/navbar/NavbarComponent';
// import Link from 'next/link';
// import { useRef, useState } from 'react';
// // import Reeact from './dashboard/page';
// import Image from 'next/image';
// import HeroComponent from '@/components/hero/HeroComponent';
// import CardComponents from '@/components/card/CardComponents';
// import { products } from '@/utils/data';
// import { useQuery } from '@tanstack/react-query';


// const Home = () =>{
 

//   const { isPending, error, data } = useQuery({
//     queryKey: ['getProducts'],
//     queryFn: () =>
//       fetch('http://localhost:3000/api/products').then((res) =>
//         res.json()
//   ),
//   });

//   console.log('product', data);
// //  const [counter, setCounter] = useState(0); 

// //  const clickRef = useRef(0);
// //  const handleClick = () => {
// //   clickRef.current = clickRef.current + 1;
// //   alert("you clicked" + clickRef.current + "times");
// //  }
//   return (

//    <>
//    <NavbarComponent/>
//           <div className="h-[100%] w-[100%] items-center justify-center">
//             <HeroComponent/>
//       <div className="h-[100%] w-[100%] flex items-center justify-center p-5  flex-wrap gap-5">
//         {data?.map((product) => (
//           <CardComponents 
//           id= {product.id}
//           key={product.id}
//           image={product.image} 
//           title={product.title} 
//           category={product.category} 
//           price={product.price}
//           slug ={product.slug}
//           />
//         ))}
//         {/* <CardComponents 
//         image={"/shoes/img1.jpeg"} 
//         title={'Air force one'} 
//         category={"Men's shoe"} 
//         price={300}
//         />
//          */}
//         </div>
//       </div>
   
//    </>
    
//   );
// }
//   export default Home;



"use client"
import NavbarComponent from '@/components/navbar/NavbarComponent';
import HeroComponent from '@/components/hero/HeroComponent';
import CardComponents from '@/components/card/CardComponents';
import { useQuery } from '@tanstack/react-query';

const SkeletonLoader = () => {
  return (
    <div className="h-[300px] w-[200px] cursor-pointer mb-5 flex flex-col gap-3 rounded overflow-hidden bg-gray-300 animate-pulse">
      <div className="absolute top-3 right-3 z-10">
        <div className="w-6 h-6 bg-gray-400 rounded-full" />
      </div>
      <div className="h-[300px] relative w-full overflow-hidden bg-gray-400" />
      <div className="p-3 flex flex-col gap-2">
        <div className="w-3/4 h-6 bg-gray-400 rounded-md" />
        <div className="w-1/2 h-6 bg-gray-400 rounded-md" />
        <div className="w-full h-10 bg-gray-400 rounded-md mt-2" />
      </div>
    </div>
  );
};

const Home = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['getProducts'],
    queryFn: () => fetch('http://localhost:3000/api/products').then((res) => res.json()),
  });

  return (
    <>
      <NavbarComponent />
      <div className="h-full w-full items-center justify-center">
        <HeroComponent />
        <div className="h-full w-full flex items-center justify-center p-5 flex-wrap gap-5">
          {isPending
            ? Array.from({ length: 6 }).map((_, index) => <SkeletonLoader key={index} />)
            : data?.map((product) => (
                <CardComponents 
                  id={product.id}
                  key={product.id}
                  image={product.image} 
                  title={product.title} 
                  category={product.category} 
                  price={product.price}
                  slug={product.slug}
                />
              ))}
        </div>
      </div>
    </>
  );
}

export default Home;

