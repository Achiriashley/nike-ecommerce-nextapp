import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function HeroComponent() {
  return (
    <div className="relative h-[80vh] w-[100%] flex items-center justify-between xl:justify-center overflow-hidden p-10 ">
    {/* Background Pattern */}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage: "url('/pattern.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    ></div>

    {/* Black Overlay */}
    <div className="absolute inset-0 bg-slate-950 opacity-90 z-10"></div>

    {/* Content */}
    <div className="relative z-10 ">
      <h1 className="text-[100px] text-[#f80] w-[100%]">NIKE AIR</h1>
      <p className="text-white md:max-w-screen-sm">
        Discover the perfect blend of style, comfort, and innovation with our
        exclusive range of Nike shoes. Whether you’re chasing your next goal,
        hitting the streets, or redefining casual, our collection is designed
        to keep you at the top of your game. Elevate your step and express
        your vibe — because every journey starts with the right pair.
      </p>
      <Link href={'/auth/signin'} className="w-[100%] lg:max-w-[500px]  bg-[#f80] rounded mt-8 p-2 text-slate-50 text-xl">
        Get Started
      </Link>
    </div>

    <Image
      src="/nike-homme.png"
      height={550}
      width={550}
      alt="Nike shoe"
      className="translate-y-36 relative z-10"
    />
  </div>
  );
}
