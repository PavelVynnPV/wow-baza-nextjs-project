import Image from "next/image";
import Link from "next/link";
import { FaInstagramSquare } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16 bg-[#1C1C1E]">
      <div className="max-w-[1300px] mx-auto px-4 py-10 flex flex-col md:flex-row flex-wrap md:justify-between justify-center text-center md:text-left items-center md:justify-items-end gap-8">
        
        <div>
          <h3 className="text-white font-bold text-lg mb-2">BAZA MARKET</h3>
          <p className="text-white/40 text-sm">© 2026 Baza Market, біржа ігрових<br />товарів та послуг</p>
        </div>

        {/* Information */}
        <div>
          <h4 className="text-white font-semibold mb-3">Information</h4>
          <ul className="flex flex-col gap-2 text-white/50 text-sm">
            <li className="hover:text-white cursor-pointer">Rules</li>
            <li className="hover:text-white cursor-pointer">Terms of Service</li>
            <li className="hover:text-white cursor-pointer">Privacy Policy</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-3">Support</h4>
          <ul className="flex flex-col gap-2 text-white/50 text-sm">
            <li className="hover:text-white cursor-pointer">Contact Support</li>
            <li className="hover:text-white cursor-pointer">My tickets</li>
            <li className="hover:text-white cursor-pointer">Contacts</li>
          </ul>
        </div>

        <div className="flex gap-3 items-start">
          {[
            { icon: '/instagram.svg', label: 'Instagram', href:"#", },
            { icon: '/telegram.svg', label: 'Telegram', href:"#" },
            { icon: '/discord.svg', label: 'Discord', href:"#" },
          ].map((s) => (
            <Link href={s.href} key={s.label} className="w-10 h-10 flex items-center justify-center">
              <img src={`${s.icon}`} alt={`${s.icon}`} className="full"/>
            </Link>
          ))}
        </div>

      </div>
    </footer>
  )
}