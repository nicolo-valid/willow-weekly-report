import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Willow — Weekly Performance Report",
  description: "Feb 9-15 vs Feb 2-8, 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
