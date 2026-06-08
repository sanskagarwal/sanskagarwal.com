import { Metadata } from "next";
import { Plus_Jakarta_Sans, Lora } from "next/font/google";

import "./globals.css";
import Navbar from "./_components/Navbar";

const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const lora = Lora({
    subsets: ["latin"],
    variable: "--font-serif",
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
        <html
            lang="en"
            className={`${jakarta.variable} ${lora.variable}`}
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInit }} />
            </head>
            <body>
                <Navbar />
                <div className="md:pl-64">{children}</div>
            </body>
        </html>
    );
}
