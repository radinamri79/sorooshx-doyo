import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Doyo - AI-Powered Service Marketplace",
  description: "Find and book local service providers with AI assistance",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
