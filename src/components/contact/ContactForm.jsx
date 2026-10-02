"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Input, Textarea, NativeSelect } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Field = ({ id, label, error, children, optional }) => (
  <div>
    <label htmlFor={id} className="text-sm font-semibold text-ink">
      {label} {optional && <span className="font-normal text-neutral-500">(optional)</span>}
    </label>
    <div className="mt-2">{children}</div>
    {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-sale" role="alert">{error.message}</p>}
  </div>
);

export default function ContactForm() {
  const formRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: { subject: "Order question" } });

  const onSubmit = async () => {
    setStatus("sending");
    try {
      await emailjs.sendForm("service_2gk6d4c", "template_n7ckemd", formRef.current, { publicKey: "-rvP0Cne37tYCWaSO" });
      reset();
      setStatus("sent");
    } catch (error) {
      console.log("FAILED...", error?.text ?? error);
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="mt-6 rounded-2xl bg-success-soft p-6" role="status">
        <p className="flex items-center gap-2 font-semibold text-ink"><CheckCircle2 className="h-5 w-5 text-success" aria-hidden /> Message sent</p>
        <p className="mt-1 text-sm text-neutral-700">Thanks for getting in touch. We’ll reply to the email address you gave us.</p>
        <Button variant="outline" className="mt-4" onClick={() => setStatus("idle")}>Send another message</Button>
      </div>
    );
  }

  const aria = (name) => ({ "aria-invalid": Boolean(errors[name]), "aria-describedby": errors[name] ? `${name}-error` : undefined });

  return (
    <form ref={formRef} onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
      <Field id="name" label="Name" error={errors.name}>
        <Input id="name" autoComplete="name" {...aria("name")} {...register("name", { required: "Name is required", pattern: { value: /^[\p{L}\s'.-]+$/u, message: "Name can only contain letters and spaces" } })} />
      </Field>
      <Field id="email" label="Email" error={errors.email}>
        <Input id="email" type="email" autoComplete="email" {...aria("email")} {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, message: "Please enter a valid email address" } })} />
      </Field>
      <Field id="phone" label="Phone" error={errors.phone}>
        <Input id="phone" type="tel" autoComplete="tel" {...aria("phone")} {...register("phone", { required: "Phone number is required", pattern: { value: /^\+?[\d\s-]{7,16}$/, message: "Please enter a valid phone number" } })} />
      </Field>
      <Field id="subject" label="Topic" error={errors.subject}>
        <NativeSelect id="subject" {...register("subject", { required: true })}>
          <option>Order question</option>
          <option>Returns & exchanges</option>
          <option>Sizing & fit</option>
          <option>Payment</option>
          <option>Something else</option>
        </NativeSelect>
      </Field>
      <div className="sm:col-span-2">
        <Field id="message" label="Message" error={errors.message}>
          <Textarea id="message" rows={6} {...aria("message")} {...register("message", { required: "Message is required", minLength: { value: 10, message: "Please add a little more detail" } })} />
        </Field>
      </div>
      {status === "error" && (
        <p className="text-sm font-medium text-sale sm:col-span-2" role="alert">We couldn’t send your message. Please try again in a moment.</p>
      )}
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={status === "sending"}>
          {status === "sending" ? <Loader2 className="animate-spin" aria-hidden /> : <Send aria-hidden />} Send message
        </Button>
      </div>
    </form>
  );
}
