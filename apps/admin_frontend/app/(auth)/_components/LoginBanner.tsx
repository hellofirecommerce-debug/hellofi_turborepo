"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function LoginBanner() {
  return (
    <div className="relative lg:w-1/2 w-full h-full bg-[rgb(33,76,123)] lg:flex items-center justify-center hidden overflow-hidden">
      {/* Grid background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgb(255,255,255) 1px, transparent 1px),
              linear-gradient(90deg, rgb(255,255,255) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>
      {/* Content */}
      <div className="relative flex flex-col items-center max-w-4xl text-center z-10">
        <Link
          href="/"
          className="block mb-4 bg-white border-4 border-gray-700 p-2 rounded-2xl"
        >
          <Image
            width={160}
            height={40}
            src="/images/logo.webp"
            alt="HelloFi Logo"
          />
        </Link>
        <p className="text-white/90 text-2xl">
          Welcome to Hellofi Admin Dashboard
        </p>
      </div>
    </div>
  );
}
