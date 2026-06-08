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
    FaLinkedin,
    FaGithub,
    FaInstagram,
    FaGoodreadsG,
    FaBars,
    FaBug,
} from "react-icons/fa6";
import { useMediaQuery } from "react-responsive";

import { NavLinks } from "../_models/NavLinks";

const navLinks: NavLinks[] = [
    {
        name: "Home",
        url: "/",
        icon: FaHouse,
    },
    {
        name: "Blog",
        url: "/blog",
        icon: FaPenToSquare,
    },
    {
        name: "Resume",
        url: "/resume",
        icon: FaFileLines,
    },
    {
        name: "Recipes",
        url: "/recipes",
        icon: FaUtensils,
    },
    {
        name: "Notes",
        url: "/notes",
        icon: FaNoteSticky,
    },
];

const socialLinks: NavLinks[] = [
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sanskar-agarwal/",
        icon: FaLinkedin,
        colorClass: "text-blue-700",
    },
    {
        name: "GitHub",
        url: "https://github.com/sanskagarwal",
        icon: FaGithub,
        colorClass: "text-black",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/sansk.agarwal/",
        icon: FaInstagram,
        colorClass: "text-pink-500",
    },
    {
        name: "Goodreads",
        url: "https://www.goodreads.com/sanskagarwal",
        icon: FaGoodreadsG,
        colorClass: "text-yellow-600",
    },
];

const Navbar: React.FC = () => {
    const currentUrl = usePathname();
    const isMobile = useMediaQuery({ maxWidth: 767 });
    const [activeMenuItem, setActiveMenuItem] = useState("");
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => setCollapsed(isMobile), [isMobile]);
    useEffect(() => {
        const isNavLink = navLinks.findIndex((link) => link.url === currentUrl);
        let activeLink = "";
        if (isNavLink !== -1) {
            activeLink = navLinks[isNavLink].name;
        }

        if (isMobile) {
            setCollapsed(true);
        }

        setActiveMenuItem(activeLink);
    }, [currentUrl, isMobile]);

    return (
        <>
            <div className="sider top-0 self-start max-h-screen grid sticky min-h-screen">
                <nav
                    className={`bg-white border border-solid border-neutral-800/15 shadow-xl flex flex-col content-center rounded-none relative transition-all duration-300 ${
                        collapsed ? "overflow-hidden w-0" : "w-64"
                    }`}
                >
                    <div className="absolute w-full top-1/6">
                        <Image
                            src="/me.png"
                            className="block mx-auto mt-16 mb-1"
                            alt="avatar"
                            width={100}
                            height={100}
                        />
                        <p className="text-center">Sanskar Agarwal</p>
                        <hr className="my-4 border-t border-neutral-200" />

                        {navLinks.map((navLink) => {
                            const NavIcon = navLink.icon;
                            return (
                                <Link
                                    onClick={() =>
                                        setActiveMenuItem(navLink.name)
                                    }
                                    key={navLink.name}
                                    href={navLink.url}
                                    className={`flex items-center gap-2 mx-4 my-1 px-3 py-2 rounded hover:text-blue-500 ${
                                        activeMenuItem === navLink.name
                                            ? "text-blue-500 font-semibold"
                                            : ""
                                    }`}
                                >
                                    <NavIcon className="shrink-0" />
                                    {navLink.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="absolute bottom-8 text-center w-full">
                        <hr className="my-4 border-t border-neutral-200" />
                        <div className="inline-flex">
                            {socialLinks.map((socialLink) => {
                                const SocialIcon = socialLink.icon;
                                return (
                                    <a
                                        className="group flex items-center justify-center p-3 bg-black/5 hover:bg-black/10 transition-colors"
                                        href={socialLink.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        key={socialLink.name}
                                    >
                                        <SocialIcon
                                            className={`${
                                                socialLink.colorClass ?? ""
                                            } group-hover:!text-blue-500`}
                                        />
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </nav>
            </div>
            <div className="header grid">
                <div className="flex items-center justify-between mb-0 ml-0 shadow px-2 py-2 bg-white">
                    <button
                        className="flex items-center justify-center p-2 rounded bg-black/5 hover:bg-black/10 hover:text-blue-500 transition-colors"
                        onClick={() => setCollapsed(!collapsed)}
                        aria-label="Toggle menu"
                    >
                        <FaBars />
                    </button>
                    <a
                        className="group flex items-center justify-center p-2 rounded bg-black/5 hover:bg-black/10 transition-colors"
                        href="https://github.com/sanskagarwal/sanskagarwal.com/issues/new"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Report a bug"
                    >
                        <FaBug className="group-hover:!text-blue-500" />
                    </a>
                </div>
                <hr className="m-0 border-t border-neutral-200" />
            </div>
        </>
    );
};

export default Navbar;
