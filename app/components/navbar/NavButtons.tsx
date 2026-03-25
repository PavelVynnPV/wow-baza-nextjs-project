"use client";

import { useEffect, useState } from "react";
import {
  Flag,
  User,
  ShoppingCart,
  MessageCircleQuestionMark,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CartDrawer from "../CartDrawer";
import { useCart } from "@/app/context/CartContext";
import { createPortal } from "react-dom";
import SupportModal from "../SupportModal";
import { AuthChangeEvent, Session } from '@supabase/supabase-js'

export default function NavButtons() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();
  const supabase = createClient();
  const [loginOpen, setLoginOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);

  const { count } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  const btnClass =
    "bg-[#FF9500]/70 rounded-lg border-none w-[35px] h-[35px] md:w-[40px] md:h-[40px] lg:w-[60px] lg:h-[45px] cursor-pointer flex items-center justify-center transition-all hover:bg-[#FF9500]";
  const iconClass =
    "w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[25px] lg:h-[25px]";

  return (
    <div className="flex gap-[20px] items-center">
      <button
        className={`${btnClass} relative`}
        onClick={() => setSupportOpen(true)}
      >
        <MessageCircleQuestionMark className={iconClass} />
      </button>
      <button className={btnClass}>
        <Flag className={iconClass} />
      </button>
      {user ? (
        <>
          <Link href="/profile" className={btnClass}>
            <User className={iconClass} />
          </Link>
          <button onClick={handleLogout} className={btnClass}>
            <LogOut className={iconClass} />
          </button>
        </>
      ) : (
        <Link href="/login" className={btnClass}>
          <User className={iconClass} />
        </Link>
      )}
      <button
        onClick={() => setCartOpen(true)}
        className={`${btnClass} relative`}
      >
        <ShoppingCart className={iconClass} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#FF9500] text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
            {count}
          </span>
        )}
      </button>
      {cartOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <CartDrawer onClose={() => setCartOpen(false)} />,
          document.body,
        )}
      {supportOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <SupportModal onClose={() => setSupportOpen(false)} />,
          document.body,
        )}
    </div>
  );
}
