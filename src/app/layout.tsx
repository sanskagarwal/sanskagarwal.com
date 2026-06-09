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
    metadataBase: new URL("https://sanskagarwal.com"),
    title: {
        default: "Sanskar Agarwal",
        template: "%s · Sanskar Agarwal",
    },
    description: "Personal website of Sanskar Agarwal — blog, notes, and recipes.",
    openGraph: {
        title: "Sanskar Agarwal",
        description:
            "Personal website of Sanskar Agarwal — blog, notes, and recipes.",
        url: "https://sanskagarwal.com",
        siteName: "Sanskar Agarwal",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Sanskar Agarwal",
        description:
            "Personal website of Sanskar Agarwal — blog, notes, and recipes.",
    },
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
            className={inter.variable}
            data-scroll-behavior="smooth"
            suppressHydrationWarning
        >
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeInit }} />
            </head>
            <body>
                <a href="#main" className="skip-link">
                    Skip to content
                </a>
                <Navbar />
                <div className="md:pl-64">
                    <main id="main">{children}</main>
                </div>
            </body>
        </html>
    );
}
