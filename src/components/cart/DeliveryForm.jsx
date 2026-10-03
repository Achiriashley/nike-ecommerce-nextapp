"use client";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Truck } from "lucide-react";
import { Input, Textarea } from "@/components/ui/input";
import { useStoreDelivery } from "@/store/delivery.store";
import { DELIVERY_CITIES } from "@/lib/delivery";

export const DELIVERY_FORM_ID = "delivery";
export const fieldId = (name) => `delivery-${name}`;

function Field({ name, label, optional, hint, error, children }) {
  return (
    <div className={name === "address" || name === "notes" ? "sm:col-span-2" : undefined}>
      <label htmlFor={fieldId(name)} className="mb-1.5 block text-sm font-medium text-ink">
        {label} {optional && <span className="font-normal text-neutral-500">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${fieldId(name)}-error`} className="mt-1.5 text-sm text-sale">{error}</p>
      ) : (
        hint && <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
      )}
    </div>
  );
}

export default function DeliveryForm({ errors = {}, onEdit }) {
  const details = useStoreDelivery((s) => s.details);
  const update = useStoreDelivery((s) => s.update);
  const fill = useStoreDelivery((s) => s.fill);
  const { user } = useUser();

  // Signed-in shoppers: start from their account name and email (never overwrites what they typed).
  useEffect(() => {
    if (user) fill({ name: user.fullName ?? "", email: user.primaryEmailAddress?.emailAddress ?? "" });
  }, [user, fill]);

  const props = (name) => ({
    id: fieldId(name),
    name,
    value: details[name] ?? "",
    onChange: (e) => {
      update(name, e.target.value);
      if (errors[name]) onEdit?.(name);
    },
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fieldId(name)}-error` : undefined,
  });

  return (
    <section id={DELIVERY_FORM_ID} className="mt-10 scroll-mt-40" aria-labelledby="delivery-heading">
      <h2 id="delivery-heading" className="flex items-center gap-2 text-xl font-semibold text-ink">
        <Truck className="h-5 w-5" aria-hidden /> Delivery details
      </h2>
      <p className="mt-1 text-sm text-neutral-600">No account needed. We’ll call this number to arrange delivery.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Full name" error={errors.name}>
          <Input {...props("name")} autoComplete="name" maxLength={80} />
        </Field>
        <Field name="phone" label="Phone number" error={errors.phone} hint="Cameroon number, e.g. 6 70 00 00 00">
          <div className="relative">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] text-neutral-500">+237</span>
            <Input {...props("phone")} type="tel" inputMode="tel" autoComplete="tel-national" placeholder="6 70 00 00 00" className="pl-14" maxLength={20} />
          </div>
        </Field>
        <Field name="city" label="City" error={errors.city}>
          <Input {...props("city")} list="delivery-cities" autoComplete="address-level2" maxLength={60} />
          <datalist id="delivery-cities">
            {DELIVERY_CITIES.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>
        <Field name="email" label="Email" optional error={errors.email} hint="For your order confirmation">
          <Input {...props("email")} type="email" inputMode="email" autoComplete="email" maxLength={120} />
        </Field>
        <Field name="address" label="Neighbourhood and landmark" error={errors.address} hint="e.g. Bonapriso, opposite Total station, blue gate">
          <Input {...props("address")} autoComplete="street-address" maxLength={200} />
        </Field>
        <Field name="notes" label="Delivery notes" optional error={errors.notes}>
          <Textarea {...props("notes")} className="min-h-[80px]" maxLength={300} placeholder="Best time to call, gate code, who will receive it…" />
        </Field>
      </div>
    </section>
  );
}
