import { Metadata } from "next";
import 'semantic-ui-css/semantic.min.css'
import "./globals.css";

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
            <body>{children}</body>
        </html>
    );
}
