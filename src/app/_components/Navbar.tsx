"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    FaHouse,
    FaPenToSquare,
    FaFileLines,
    FaUtensils,
    FaNoteSticky,
    FaBars,
    FaXmark,
    FaBug,
} from "react-icons/fa6";

import { NavLinks } from "../_models/NavLinks";
import { socialLinks } from "../_utils/SocialLinks";
import { cn } from "../_utils/cn";
import ThemeToggle from "./ThemeToggle";

const navLinks: NavLinks[] = [
    { name: "Home", url: "/", icon: FaHouse },
    { name: "Blog", url: "/blog", icon: FaPenToSquare },
    { name: "Resume", url: "/resume", icon: FaFileLines },
    { name: "Recipes", url: "/recipes", icon: FaUtensils },
    { name: "Notes", url: "/notes", icon: FaNoteSticky },
];

const isActive = (pathname: string, url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

const SidebarContent: React.FC<{ pathname: string }> = ({ pathname }) => (
    <div className="flex h-full flex-col">
        <div className="flex flex-col items-center gap-1.5 border-b border-border px-6 py-7">
            <Image
                src="/me.png"
                alt="Portrait of Sanskar Agarwal"
                width={88}
                height={88}
                className="rounded-full border border-border"
            />
            <p className="mt-1 font-semibold">Sanskar Agarwal</p>
            <p className="text-xs text-muted-foreground">Software Engineer</p>
        </div>

        <nav
            className="flex-1 overflow-y-auto px-3 py-4"
            aria-label="Primary"
        >
            <ul className="flex flex-col gap-1">
                {navLinks.map((link) => {
                    const Icon = link.icon;
                    const active = isActive(pathname, link.url);
                    return (
                        <li key={link.name}>
                            <Link
                                href={link.url}
                                aria-current={active ? "page" : undefined}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                                    active
                                        ? "bg-accent text-primary"
                                        : "text-foreground hover:bg-accent hover:text-primary"
                                )}
                            >
                                <Icon className="shrink-0" />
                                {link.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>

        <div className="border-t border-border px-4 py-4">
            <div className="flex items-center justify-center gap-1">
                {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={social.name}
                            className="group flex h-9 w-9 items-center justify-center rounded-md transition-colors hover:bg-accent"
                        >
                            <Icon
                                className={cn(
                                    social.colorClass,
                                    "group-hover:!text-primary"
                                )}
                            />
                        </a>
                    );
                })}
            </div>
            <div className="mt-3 flex items-center justify-between">
                <a
                    href="https://github.com/sanskagarwal/sanskagarwal.com/issues/new"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Report a bug"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                    <FaBug />
                </a>
                <ThemeToggle />
            </div>
        </div>
    </div>
);

const Navbar: React.FC = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const menuButtonRef = React.useRef<HTMLButtonElement>(null);
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setOpen(false);
    }, [pathname]);

    // Close the drawer on Escape and move focus to the close button when opened.
    useEffect(() => {
        if (!open) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("keydown", onKeyDown);
        closeButtonRef.current?.focus();
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [open]);

    // Restore focus to the menu trigger once the drawer is dismissed.
    const closeDrawer = () => {
        setOpen(false);
        menuButtonRef.current?.focus();
    };

    return (
        <>
            {/* Mobile top bar */}
            <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
                <button
                    ref={menuButtonRef}
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open menu"
                    aria-expanded={open}
                    aria-controls="mobile-nav-drawer"
                    className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                >
                    <FaBars />
                </button>
                <Link href="/" className="font-semibold">
                    Sanskar Agarwal
                </Link>
                <ThemeToggle />
            </header>

            {/* Mobile drawer */}
            <div
                id="mobile-nav-drawer"
                className={cn(
                    "fixed inset-0 z-40 md:hidden",
                    open ? "pointer-events-auto" : "pointer-events-none"
                )}
                aria-hidden={!open}
            >
                <div
                    className={cn(
                        "absolute inset-0 bg-black/50 transition-opacity",
                        open ? "opacity-100" : "opacity-0"
                    )}
                    onClick={closeDrawer}
                />
                <aside
                    role="dialog"
                    aria-modal="true"
                    aria-label="Site navigation"
                    className={cn(
                        "absolute left-0 top-0 h-full w-64 border-r border-border bg-card shadow-xl transition-transform duration-300",
                        open ? "translate-x-0" : "-translate-x-full"
                    )}
                >
                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={closeDrawer}
                        aria-label="Close menu"
                        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                    >
                        <FaXmark />
                    </button>
                    <SidebarContent pathname={pathname} />
                </aside>
            </div>

            {/* Desktop sidebar */}
            <aside className="fixed left-0 top-0 z-20 hidden h-screen w-64 border-r border-border bg-card md:block">
                <SidebarContent pathname={pathname} />
            </aside>
        </>
    );
};

export default Navbar;
