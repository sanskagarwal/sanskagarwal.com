import { Metadata } from "next";

import "semantic-ui-css/semantic.min.css";
import "./globals.css";
import Navbar from "./_components/Navbar";

export const metadata: Metadata = {
    title: "Sanskar Agarwal",
    description: "Personal Website",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <div className="mainWrapper grid">
                    <Navbar />
                    <div className="content">{children}</div>
                </div>
            </body>
        </html>
    );
}
