import "./globals.css";
import { EventsProvider } from "@/context/EventsContext";
import { WalletProvider } from "@/context/WalletContext";
import Header from "./components/Header";

export const metadata = {
  title: "CloverTrade | Next-Gen DeFi on Stellar",
  description: "CloverTrade is the high-performance Soroban engine for tokens, liquidity, and governance on Stellar.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="light">
      <body className="antialiased min-h-screen flex flex-col transition-colors duration-300">
        <WalletProvider>
          <EventsProvider>
            <Header />
            <main className="flex-1">
              {children}
            </main>
          </EventsProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
