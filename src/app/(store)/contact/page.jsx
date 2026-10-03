import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { FREE_SHIPPING_THRESHOLD, FLAT_SHIPPING, PAYMENT_METHODS_TEXT, RETURN_DAYS } from "@/config/store";
import { formatPrice } from "@/lib/format";

export const metadata = { title: "Help & contact" };

const FAQ = [
  {
    q: "How much is delivery?",
    a: `Delivery is free on orders over ${formatPrice(FREE_SHIPPING_THRESHOLD)}. Smaller orders have a flat ${formatPrice(FLAT_SHIPPING)} delivery fee, shown in your bag before you pay.`,
  },
  {
    q: "What is your returns policy?",
    a: `You can return unworn shoes in their original box within ${RETURN_DAYS} days of delivery. Send us a message with your order reference and we’ll guide you through it.`,
  },
  {
    q: "Which payment methods do you accept?",
    a: `You can pay with ${PAYMENT_METHODS_TEXT}. You approve the payment on your phone or on the provider’s secure page.`,
  },
  {
    q: "How do I find my size?",
    a: "Our shoes use US sizing. If you’re between sizes we recommend sizing up, especially for training and basketball shoes. Customer reviews often mention fit too.",
  },
  {
    q: "Where can I see my order?",
    a: "If you were signed in when you checked out, your orders and their status appear on your account page.",
  },
];

export default function ContactPage() {
  return (
    <div className="container pt-6 md:pt-8">
      <section className="relative overflow-hidden rounded-[28px] bg-surface">
        <div className="grid items-center lg:grid-cols-2">
          <div className="px-6 py-12 sm:px-10 lg:px-14">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand-dark">Help centre</p>
            <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">How can we help?</h1>
            <p className="mt-4 max-w-md text-[17px] text-neutral-700">Questions about sizing, an order or a return? Check the answers below or send us a message.</p>
            <ul className="mt-8 space-y-3 text-[15px] text-ink">
              <li className="flex items-center gap-3"><Mail className="h-5 w-5" aria-hidden /> Message us using the form below</li>
              <li className="flex items-center gap-3"><MapPin className="h-5 w-5" aria-hidden /> Douala, Cameroon</li>
            </ul>
          </div>
          <div className="relative hidden h-full min-h-[360px] lg:block">
            <Image src="/products/support.webp" alt="" fill sizes="50vw" className="object-cover" priority />
          </div>
        </div>
      </section>

      <div className="mt-16 grid gap-14 lg:grid-cols-2">
        <section id="faq" className="scroll-mt-40" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl font-semibold tracking-tight text-ink">Frequently asked questions</h2>
          <div className="mt-6 divide-y border-y">
            {FAQ.map((item, i) => (
              <details key={item.q} open={i === 0} className="group py-5 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[16px] font-semibold text-ink">
                  {item.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface text-lg leading-none transition group-open:rotate-45" aria-hidden>+</span>
                </summary>
                <p className="mt-3 pr-10 text-[15px] leading-relaxed text-neutral-700">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section aria-labelledby="form-heading">
          <h2 id="form-heading" className="text-2xl font-semibold tracking-tight text-ink">Send us a message</h2>
          <p className="mt-2 text-neutral-600">Include your order reference if your question is about an order.</p>
          <ContactForm />
        </section>
      </div>

      <section className="mt-16 overflow-hidden rounded-[28px] border" aria-label="Map">
        <iframe
          title="Store location map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d250.09042906692608!2d9.695180069064664!3d4.042658402349319!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1061138910bc3aff%3A0x7b5d5c6ad0bcf7f!2sSeven%20Advanced%20Academy!5e0!3m2!1sen!2srw!4v1731057270390!5m2!1sen!2srw"
          className="h-[360px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </section>
    </div>
  );
}
