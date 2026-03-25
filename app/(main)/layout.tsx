import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import Features from "../components/features/Features";
import { CartProvider } from "../context/CartContext";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Navbar />
      {children}
      <Features />
      <Footer />
    </CartProvider>
  );
}