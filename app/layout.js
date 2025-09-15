import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppTabs from "./components/Navbar";


// If you already have a top Navbar component, you can import & place it too:
// import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Dundaing — Events",
  description: "Discover, filter, and book the best events.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50`}
      >
        {/* Optional main navbar (desktop): */}
        {/* <Navbar /> */}

        {/* Tabs: top on md+ screens, bottom on mobile */}
       <AppTabs />

        {/* Space for content; bottom padding so content isn't hidden behind mobile tab bar */}
        <main className="min-h-dvh pb-20 md:pb-0">{children}</main>
      </body>
    </html>
  );
}
