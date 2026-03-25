"use client";

import { useEffect, useState } from "react";
import { Product, Server, ProductTemplate, Game } from "@/types";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { ChevronDown } from "lucide-react";

export default function ProductClient({
  product,
  template,
  servers,
  game,
  gameSlug,
}: {
  product: Product;
  game: Game;
  template: ProductTemplate | null;
  servers: Server[];
  gameSlug: string;
}) {
  const [activeTab, setActiveTab] = useState<
    "description" | "how_it_works" | "payments_info"
  >("description");
  const [amount, setAmount] = useState("");
  const [nickname, setNickname] = useState("");
  const [faction, setFaction] = useState("");
  const [factionOpen, setFactionOpen] = useState(false);
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const { addItem } = useCart();

  useEffect(() => {
    const getUser = async () => {
      const supabaseClient = createClient();
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const tabs = [
    { key: "description", label: "DESCRIPTION" },
    { key: "how_it_works", label: "HOW IT WORKS" },
    { key: "payments_info", label: "PAYMENTS AND CONTACTS" },
  ];

  const handleAddToCart = async () => {
    if (!amount || !nickname || !faction) {
      alert("Please fill in all fields!");
      return;
    }

    if (!currentUser) {
      router.push("/login");
      return;
    }

    if (isGold && !amount) {
      alert("Please enter amount!");
      return;
    }

    await addItem({
      product_id: product.id,
      title: product.title,
      image_url: product.image_url,
      price: calculatedPrice,
      amount,
      nickname,
      faction,
      server_id: product.server_id,
      game_slug: product.game_slug,
    });

    alert("Added to cart! 🛒");
    setAmount("");
    setNickname("");
    setFaction("");
  };

  const isGold = product.category === "gold";

  const calculatedPrice = isGold && amount 
  ? (parseFloat(amount) / 1000) * product.price 
  : product.price;

  return (
    <div className="max-w-[1700px] mx-auto px-4 py-10 text-white flex flex-col lg:flex-row gap-[37px] mb-[70px] lg:items-start">
      <div className="flex-1 min-w-0 w-full">
        <h1 className="font-rocker text-[32px] md:text-[45px] lg:text-[50px] mb-[20px] lg:mb-[32px] leading-tight">
          {game.title} {product.title}
        </h1>
        <p className="text-[#FFC608] text-[30px] md:text-[40px] lg:text-[50px] font-semibold mb-[20px] lg:mb-[32px] flex items-center gap-[10px] capitalize">
          <img
            src={`${template?.icon_img}`}
            alt="product_icon"
            className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px]"
          />{" "}
          {product.category}
        </p>
        <div className="flex gap-10">
          <div className="flex-1 w-[500px] lg:w-[1000px]">
            <div className="flex gap-[15px] md:gap-[30px] border-b border-white/20 mb-[25px] lg:mb-[35px] overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`pb-2 text-[10px] md:text-[18px] lg:text-[20px] font-semibold cursor-pointer transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key
                      ? "border-white text-white"
                      : "border-transparent text-white/50 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex flex-col">
              <h2 className="text-red-500 font-semibold text-[16px] md:text-[28px] lg:text-[30px] mb-[25px] lg:mb-[35px] tracking-wider">
                {template?.title}
              </h2>
              {template?.[activeTab]
                ?.split("\n")
                .filter((p) => p.trim() !== "")
                .map((paragraph, i) => (
                  <p
                    key={`paragraph-${i}`}
                    className="text-white/80 text-[12px] md:text-[14px] tracking-wide mb-4 leading-relaxed"
                  >
                    {paragraph}
                  </p>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-[500px] lg:shrink-0 lg:h-[700px]">
        <div className="w-full bg-[#2F292D] rounded-xl p-6 flex flex-col gap-[20px] h-full overflow-hidden">
          {currentUser ? (
            <>
              <div className="flex flex-col gap-[20px]">
                {isGold && (
                  <>
                    <input
                      type="number"
                      placeholder="amount (gold)..."
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-white/10 rounded-lg px-4 py-3 text-white outline-none placeholder:text-white/40"
                    />
                    {amount && (
                      <p className="text-[#FF9500] font-bold text-sm">
                        Total: $ {calculatedPrice.toFixed(2)}
                      </p>
                    )}
                  </>
                )}
                <input
                  type="text"
                  placeholder="character nickname"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="bg-white/10 rounded-lg px-4 py-2 text-white outline-none placeholder:text-white/40"
                />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setFactionOpen(!factionOpen)}
                    className="w-full bg-white/10 rounded-lg px-4 py-2 text-white text-left flex justify-between items-center"
                  >
                    {faction || "choose faction"}
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${factionOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {factionOpen && (
                    <div className="absolute w-full bg-[#2F292D] border border-white/20 rounded-lg mt-1 z-10 overflow-hidden">
                      {["", "Horde", "Alliance"].map((option) => (
                        <button
                          type="button"
                          key={option}
                          onClick={() => {
                            setFaction(option.toLowerCase());
                            setFactionOpen(false);
                          }}
                          className="w-full px-4 py-2 text-white text-left hover:bg-white/10 transition-all"
                        >
                          {option || "choose faction"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={handleAddToCart}
                className="bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white cursor-pointer w-full"
              >
                Add to cart
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-4 py-6">
              <p className="text-white/50 text-sm text-center">
                Please log in to place an order
              </p>
              <Link
                href="/login"
                className="w-full bg-[#FF9500] hover:bg-[#FF9500]/80 transition-all rounded-lg py-3 font-bold text-white text-center"
              >
                Login to Order
              </Link>
              <Link
                href="/register"
                className="w-full bg-white/10 hover:bg-white/20 transition-all rounded-lg py-3 font-bold text-white text-center"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
