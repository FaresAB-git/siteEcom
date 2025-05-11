import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./components/Header"
import { Roboto } from 'next/font/google'
import { CartProvider } from "./context/CartContext";
 
// If loading a variable font, you don't need to specify the font weight
const roboto = Roboto({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}
