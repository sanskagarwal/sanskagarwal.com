import { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import Navbar from "./_components/Navbar";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Sanskar Agarwal",
    description: "Personal Website",
};

const themeInit = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;if(d)document.documentElement.classList.add("dark");}catch(e){}})();`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={inter.variable} suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInit }} />
            </head>
            <body>
                <div className="mainWrapper grid">
                    <Navbar />
                    <div className="content">{children}</div>
                </div>
            </body>
        </html>
    );
}
