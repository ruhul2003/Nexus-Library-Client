import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "../Components/NavBar";

export const metadata = {
  title: "Library Nexus",
  description: "Your One-Stop Library Solution",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" >
      <body className="min-h-full flex flex-col">

      <NavBar />
        <main>{children}</main>


      </body>
    </html>
  );
}
