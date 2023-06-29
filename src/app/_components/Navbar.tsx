"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Button,
    Menu,
    Divider,
    Image,
    Icon,
    SemanticICONS,
} from "semantic-ui-react";
import { useMediaQuery } from "react-responsive";

type NavLinks = {
    name: string;
    url: string;
    icon: SemanticICONS;
};

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
    const isNavLink = navLinks.findIndex((link) => link.url === currentUrl);
    let activeLink = "";
    if (isNavLink !== -1) {
        activeLink = navLinks[isNavLink].name;
    }

    const [activeMenuItem, setActiveMenuItem] = useState(activeLink);
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => setCollapsed(isMobile), [isMobile]);

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
                        className="w-24 mt-16 mb-1"
                        alt="avatar"
                        centered
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
                                />{" "}
                                {navLink.name}
                            </Link>
                        );
                    })}

                    <div className="absolute bottom-8 text-center w-full">
                        <Divider />
                        <Button.Group size="large">
                            <Button icon="linkedin" />
                            <Button icon="github" />
                            <Button icon="instagram" />
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
                                <Button icon="bug" />
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
