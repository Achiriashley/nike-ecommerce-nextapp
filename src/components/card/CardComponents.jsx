import Image from 'next/image'
import React from 'react'

export default function CardComponents() {
  return (
    
      <div className="h-[500px] w-[400px] bg-slate-950 cursor-pointer mb-5 flex flex-col gap-3 rounded overflow-hidden">
          <div className="h-[300px] relative w-[100%] overflow-hidden">
            <Image
            src={"/shoes/img1.jpeg"} 
            fill
            objectFit="cover"
            Object="center"
            alt=""
            />
          </div>
        </div>

  )
}
