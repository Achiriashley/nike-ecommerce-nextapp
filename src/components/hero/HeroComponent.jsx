import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function HeroComponent() {
  return (
    <div className="h-[100vh] w-[100%] bg-slate-950 flex items-center justify-center">
      <h1 className="text-[250px] text-[#f80]">NIKE AIR</h1>
      <Image src="/nikeshoe.png" height={400} width={400} alt='Nike shoe' className=" absolute -rotate-45 cursor-pointer"/>
    </div>
  )
}
