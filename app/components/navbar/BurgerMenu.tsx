"use client";

import { useState } from "react";
import {
  Menu,
  X,
  MessageCircleQuestionMark,
  Flag,
  User,
  ShoppingCart,
} from "lucide-react";
import Image from "next/image";

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden bg-[#FF9500]/70 rounded-lg w-[35px] h-[35px] flex items-center justify-center ml-5"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
  
      <div
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
  
      <div className={`lg:hidden fixed top-0 left-0 h-full w-[280px] bg-[#0a0a0a] z-50 flex flex-col p-6 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="flex items-center justify-between mb-8">
          <Image src="/logo.png" alt="logo" width={60} height={60} className="object-contain" />
          <button onClick={() => setIsOpen(false)}>
            <X size={28} className="text-white" />
          </button>
        </div>
  
        <button className="bg-[#FF9500]/70 rounded-lg py-3 font-semibold text-white mb-6">
          Catalog
        </button>
  
        <input
          type="text"
          placeholder="Search..."
          className="bg-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/50 mb-6 outline-none"
        />
  
        <div className="flex gap-4">
          {[MessageCircleQuestionMark, Flag, User, ShoppingCart].map((Icon, index) => (
            <button key={index} className="bg-[#FF9500]/70 rounded-lg w-[45px] h-[45px] flex items-center justify-center">
              <Icon size={20} className="text-white" />
            </button>
          ))}
        </div>
  
      </div>
    </>
  )
}
