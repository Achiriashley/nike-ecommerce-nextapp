import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import CartDrawer from "@/components/cart/CartDrawer";

export default function StoreLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1">{children}</main>
      <SiteFooter />
      <CartDrawer />
    </div>
  );
}
