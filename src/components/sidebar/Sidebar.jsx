import { Colors } from '@/utils/constants';
import React, { useState } from 'react'
import { GiShop } from "react-icons/gi";
const Sidebar = () => {
    const [active, setActive] = useState("Dashboard");

    const menuItems = [
        { name: "Dashboard" },
        { name: "Orders" },
        { name: "Categories" },
        { name: "Transactions" },
        { name: "Deliveries" },
        { name: "Customers" }
      ];

  return (
    <div className="bg-[#ebebebe3] h-[100vh] w-1/4 shadow-right">
      <h1 className='text-black pl-5 font-bold text-2xl m-2.5'>Nike</h1>
      <div className='flex flex-col items-center mt-[50px] gap-3 cursor-pointer' >
        <div className={`bg-white pl-5 flex  items-center w-[100%] py-3 h-fit border-r-4 border-[${Colors.primary}] gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Dashboard</h2>
          </div>
        <div className={`flex pl-5 items-center w-[100%] py-3 h-fit  gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Orders</h2>
          </div>
        <div className={` flex pl-5 items-center w-[100%] py-3 h-fit  gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Categories</h2>
          </div>
        <div className={` flex pl-5 items-center w-[100%] py-3 h-fit  gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Transactions</h2>
          </div>
        <div className={` flex pl-5 items-center w-[100%] py-3 h-fit  gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Deliveries</h2>
          </div>
        <div className={` flex pl-5 items-center w-[100%] py-3 h-fit  gap-5`}>
        <GiShop color={Colors.primary} size={20}/>
          <h2 className='text-lg font-semibold text-gray-700'>Customers</h2>
          </div>
       </div>
</div>
  )
}

export default Sidebar


// import { Colors } from '@/utils/constants';
// import React, { useState } from 'react';
// import { GiShop } from "react-icons/gi";

// const Sidebar = () => {
//   const [active, setActive] = useState("Dashboard");

//   const menuItems = [
//     { name: "Dashboard" },
//     { name: "Orders" },
//     { name: "Categories" },
//     { name: "Transactions" },
//     { name: "Deliveries" },
//     { name: "Customers" }
//   ];

//   return (
//     <div className="bg-[#ebebebe3] h-[100%] w-1/4 shadow-right">
//       <h1 className='text-black pl-5 font-bold text-2xl m-2.5'>Nike</h1>
//       <div className='flex flex-col items-center mt-[50px] gap-3 cursor-pointer'>
//         {menuItems.map((item) => (
//           <div 
//             key={item.name} 
//             className={`pl-5 flex items-center w-full py-3 h-fit gap-5 border-r-4 ${active === item.name ? "bg-white border-primary" : ""}`} 
//             onClick={() => setActive(item.name)}
//           >
//             <GiShop color={Colors.primary} size={20} />
//             <h2 className='text-lg font-semibold text-gray-700'>{item.name}</h2>
//           </div>
//         ))}
//       </div>
// {/* Divider */}
//         <div className="w-[90%] h-0.5 bg-gray-300"></div>
//       <div className=" flex flex-col p-5 gap-3">
//         <h2 classNmae={`font-bold text-[${Colors.primary}] text-lg`}> Customer Service</h2>
//         <p>Ask you quickly, place request or important issues.
//         Our support will contact 24/7 to you. </p>
//         <button className="w-full roound-lg py-3 text-white bg-[#f80] font-semibold">Logout </button>
//          </div>
//     </div>
//   );
// }

// export default Sidebar;