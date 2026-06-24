import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import HeaderAuth from "@/components/HeaderAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Signal Workflows | Proven AI Use Cases",
  description: "The proof-of-work board for AI. Discover verified workflows that actually drive business results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ padding: '20px 0', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
          <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none', fontWeight: 'bold', fontSize: '1.2rem' }}>
              Signal Workflows
            </a>
            <HeaderAuth />
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
