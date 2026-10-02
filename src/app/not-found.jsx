import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-sm font-semibold uppercase tracking-widest text-brand-dark">404</p>
      <h1 className="text-3xl font-semibold text-ink">Page not found</h1>
      <Link href="/" className="rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white">Back to the store</Link>
    </main>
  );
}
