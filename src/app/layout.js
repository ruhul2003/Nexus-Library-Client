import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../Components/NavBar";
import Footer from "@/Components/Footer";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata = {
  title: "Library Nexus",
  description: "Your One-Stop Library Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={`h-full ${geist.variable}`}>
      <body className="min-h-screen flex bg-linear-to-br from-slate-950 to-indigo-950 bg-no-repeat bg-fixed flex-col text-white font-sans antialiased">
        <NavBar />
        
        <main className="flex-1 w-full  mx-auto px-4 md:px-8 py-8">
          {children}

          <Footer />
        </main>
      </body>
    </html>
  );
}