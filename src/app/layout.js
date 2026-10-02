import localFont from "next/font/local";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer } from "react-toastify";
import QueryProvider from "@/components/providers/QueryProvider";
import StoreHydration from "@/components/providers/StoreHydration";
import { STORE_NAME } from "@/config/store";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: { default: `${STORE_NAME} · Sneakers for every move`, template: `%s · ${STORE_NAME}` },
  description: "Shop lifestyle, training, basketball and golf sneakers for men, women and kids. Free delivery on qualifying orders and easy returns.",
};

export const viewport = {
  themeColor: "#111111",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider signInUrl="/auth/signin" signUpUrl="/auth/signup" afterSignOutUrl="/">
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <QueryProvider>
            <StoreHydration />
            {children}
          </QueryProvider>
          <ToastContainer position="bottom-center" autoClose={2500} hideProgressBar closeOnClick newestOnTop limit={3} />
        </body>
      </html>
    </ClerkProvider>
  );
}
