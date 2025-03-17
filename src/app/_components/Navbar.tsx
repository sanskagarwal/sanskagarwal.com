"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button, Menu, Divider, Icon } from "semantic-ui-react";
import { useMediaQuery } from "react-responsive";

import { NavLinks } from "../_models/NavLinks";

const navLinks: NavLinks[] = [
    {
        name: "Home",
        url: "/",
        icon: "home",
    },
    {
        name: "Blog",
        url: "/blog",
        icon: "edit",
    },
    {
        name: "Resume",
        url: "/resume",
        icon: "file alternate",
    },
];

const socialLinks: NavLinks[] = [
    {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/sanskar-agarwal/",
        icon: "linkedin",
    },
    {
        name: "GitHub",
        url: "https://github.com/sanskagarwal",
        icon: "github",
    },
    {
        name: "Instagram",
        url: "https://www.instagram.com/sansk.agarwal/",
        icon: "instagram",
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
                <Menu
                    secondary
                    vertical
                    className={`!border !border-solid !border-neutral-800/[0.15] !shadow-xl flex flex-col content-center !m-0 !rounded-none relative transition-all duration-300 ${
                        collapsed ? "overflow-hidden !w-0" : ""
                    }`}
                >
                    <div className="absolute w-full top-1/4">
                        <Image
                            src="/me.png"
                            className="ui image centered mt-16 mb-1"
                            alt="avatar"
                            width={100}
                            height={100}
                        />
                        <p className="text-center">Sanskar Agarwal</p>
                        <Divider />

                        {navLinks.map((navLink) => {
                            return (
                                <Link
                                    onClick={() =>
                                        setActiveMenuItem(navLink.name)
                                    }
                                    key={navLink.name}
                                    href={navLink.url}
                                    className={`hover:!text-blue-500 !mx-4 !my-1 item ${
                                        activeMenuItem === navLink.name &&
                                        "active !text-blue-500"
                                    }`}
                                >
                                    <Icon
                                        name={navLink.icon}
                                        className="!mr-1 !float-none"
                                    />
                                    {navLink.name}
                                </Link>
                            );
                        })}
                    </div>

                    <div className="absolute bottom-8 text-center w-full">
                        <Divider />
                        <Button.Group className="bottom-buttons" size="large">
                            {socialLinks.map((socialLink) => {
                                return (
                                    <a
                                        className="ui icon button hover:!text-blue-500"
                                        href={socialLink.url}
                                        target="_blank"
                                        key={socialLink.name}
                                    >
                                        <Icon name={socialLink.icon} />
                                    </a>
                                );
                            })}
                        </Button.Group>
                    </div>
                </Menu>
            </div>
            <div className="header grid">
                <Menu
                    secondary
                    className="!mb-0 !ml-0 !shadow"
                >
                    <Menu.Item>
                        <Button
                            className="hover:!text-blue-500"
                            icon="bars"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Button.Group>
                                <a
                                    className="ui icon button hover:!text-blue-500"
                                    href="https://github.com/sanskagarwal/sanskagarwal.com/issues/new"
                                    target="_blank"
                                >
                                    <Icon name="bug" />
                                </a>
                            </Button.Group>
                        </Menu.Item>
                    </Menu.Menu>
                </Menu>
                <Divider className="!m-0" />
            </div>
        </>
    );
};

export default Navbar;
