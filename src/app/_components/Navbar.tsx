"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
    Button,
    Menu,
    Divider,
    Icon,
} from "semantic-ui-react";
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

        setActiveMenuItem(activeLink);
    }, [currentUrl]);

    return (
        <>
            <div className="sider top-0 self-start max-h-screen grid sticky min-h-screen">
                <Menu
                    secondary
                    vertical
                    className={`flex flex-col content-center !m-0 !rounded-none relative transition-all duration-300 ${
                        collapsed ? "overflow-hidden !w-0" : ""
                    }`}
                    style={{
                        borderLeft: "1px solid rgba(255,255,255,.1)",
                        borderRight: "1px solid rgba(34,36,38,.15)",
                    }}
                >
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
                                onClick={() => setActiveMenuItem(navLink.name)}
                                key={navLink.name}
                                href={navLink.url}
                                className={`item ${
                                    activeMenuItem === navLink.name && "active"
                                }`}
                            >
                                <Icon
                                    name={navLink.icon}
                                    className="!float-none"
                                />
                                {navLink.name}
                            </Link>
                        );
                    })}

                    <div className="absolute bottom-8 text-center w-full">
                        <Divider />
                        <Button.Group size="large">
                            <a
                                className="ui icon button"
                                href="https://www.linkedin.com/in/sanskar-agarwal/"
                                target="_blank"
                            >
                                <Icon name="linkedin" />
                            </a>
                            <a
                                className="ui icon button"
                                href="https://github.com/sanskagarwal"
                                target="_blank"
                            >
                                <Icon name="github" />
                            </a>
                            <a
                                className="ui icon button"
                                href="https://www.instagram.com/sansk.agarwal/"
                                target="_blank"
                            >
                                <Icon name="instagram" />
                            </a>
                        </Button.Group>
                    </div>
                </Menu>
            </div>
            <div className="header grid">
                <Menu secondary className="!mb-0 !ml-0">
                    <Menu.Item>
                        <Button
                            icon="bars"
                            onClick={() => setCollapsed(!collapsed)}
                        />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        <Menu.Item>
                            <Button.Group>
                                <a
                                    className="ui icon button"
                                    href="https://github.com/sanskagarwal/sanskagarwal.com/issues/new"
                                    target="_blank"
                                >
                                    <Icon name="bug" />
                                </a>
                                <Button icon="sun" />
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
