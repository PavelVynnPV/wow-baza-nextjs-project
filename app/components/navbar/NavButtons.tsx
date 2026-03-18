import { ReactNode } from "react";
import {
  Search,
  Flag,
  User,
  ShoppingCart,
  MessageCircleQuestionMark,
} from "lucide-react";

interface NavButton {
  icon: ReactNode;
  onClick?: () => void;
  href?: string;
}

const buttons: NavButton[] = [
  {
    icon: (
      <MessageCircleQuestionMark className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[25px] lg:h-[25px]" />
    ),
  },
  {
    icon: (
      <Flag className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[25px] lg:h-[25px]" />
    ),
  },
  {
    icon: (
      <User className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[25px] lg:h-[25px]" />
    ),
  },
  {
    icon: (
      <ShoppingCart className="w-[16px] h-[16px] md:w-[18px] md:h-[18px] lg:w-[25px] lg:h-[25px]" />
    ),
  },
];

export default function NavButtons() {
  return (
    <div style={{ display: "flex", gap: "20px" }}>
      {buttons.map((btn, index) => (
        <button
          key={index}
          onClick={btn.onClick}
          className="bg-[#FF9500]/70 rounded-lg border-none w-[35px] h-[35px] md:w-[40px] md:h-[40px] lg:w-[60px] lg:h-[45px] cursor-pointer flex items-center justify-center transition-all"
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}
