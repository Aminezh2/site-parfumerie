import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/playfair-display";
import { CartProvider } from "@/context/CartContext";
import { ThemeProvider } from "@/context/ThemeContext";
import CartDrawer from "@/components/ui/CartDrawer";
import "./globals.css";

export const metadata: Metadata = {
  title: "FSAHI FRAGRANCES | Parfums & Décants",
  description: "Des parfums originaux, choisis selon vos envies. Une sélection d'exception en formats décants 5 ml & 10 ml.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "FSAHI FRAGRANCES | Parfums & Décants",
    description: "Des parfums originaux, choisis selon vos envies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="scroll-smooth dark">
      <body
        className="antialiased bg-background text-foreground transition-colors duration-500"
      >
        <ThemeProvider>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

