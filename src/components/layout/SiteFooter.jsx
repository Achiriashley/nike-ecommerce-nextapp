import Link from "next/link";
import { ShieldCheck, RotateCcw, Truck, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";
import { FREE_SHIPPING_THRESHOLD, PAYMENT_METHODS_TEXT, RETURN_DAYS, STORE_NAME } from "@/config/store";
import { formatPrice } from "@/lib/format";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      ["New & Featured", "/shop?sort=newest"],
      ["Men", "/shop?gender=men"],
      ["Women", "/shop?gender=women"],
      ["Kids", "/shop?gender=kids"],
      ["Sale", "/shop?sale=1"],
    ],
  },
  {
    title: "Categories",
    links: [
      ["Lifestyle", "/shop?category=Lifestyle"],
      ["Training", "/shop?category=Training"],
      ["Basketball", "/shop?category=Basketball"],
      ["Golf", "/shop?category=Golf"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Contact us", "/contact"],
      ["Order status", "/account"],
      ["Delivery & returns", "/contact#faq"],
      ["Payment options", "/contact#faq"],
    ],
  },
  {
    title: "Account",
    links: [
      ["Sign in", "/auth/signin"],
      ["Create account", "/auth/signup"],
      ["Wishlist", "/wishlist"],
      ["Bag", "/cart"],
    ],
  },
];

const PROMISES = [
  { icon: Truck, title: "Free delivery", text: `On orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}` },
  { icon: RotateCcw, title: `${RETURN_DAYS}-day returns`, text: "Changed your mind? Send it back" },
  { icon: ShieldCheck, title: "Secure checkout", text: PAYMENT_METHODS_TEXT },
  { icon: MessageCircle, title: "Need help?", text: "Our team is a message away" },
];

export default function SiteFooter() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="border-b border-white/10">
        <ul className="container grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
          {PROMISES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10">
                <Icon className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block text-sm text-white/65">{text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="container grid gap-12 py-14 lg:grid-cols-[1.3fr_2fr]">
        <div className="max-w-sm">
          <Logo inverse />
          <p className="mt-4 text-sm leading-relaxed text-white/65">
            Sneakers for every court, gym and street. Join the list for early access to new drops and offers.
          </p>
          <NewsletterForm inverse className="mt-6" />
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="text-sm font-semibold">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-white/65 transition hover:text-white">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container flex flex-col gap-2 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE_NAME}. All rights reserved.</p>
          <p>All prices in FCFA. Pay securely with {PAYMENT_METHODS_TEXT}.</p>
        </div>
      </div>
    </footer>
  );
}
