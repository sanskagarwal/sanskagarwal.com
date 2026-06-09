import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resume",
    description: "Resume of Sanskar Agarwal, Full-Stack & Security Engineer.",
    alternates: { canonical: "/resume" },
};

const ResumeLayout = ({ children }: { children: React.ReactNode }) => children;

export default ResumeLayout;
