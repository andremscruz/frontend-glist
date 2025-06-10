import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Glist - Organize Your Groceries",
  keywords: "grocery list, shopping list, groceries, organize, manage, next.js, react",
  authors: [{ name: "Andre Cruz", url: "https://frontend-glist.vercel.app/" }],
  description: "Organize your grocery shopping with Glist. Easily manage your grocery list, track items, and collaborate with others.",
  creator: "Andre Cruz",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
