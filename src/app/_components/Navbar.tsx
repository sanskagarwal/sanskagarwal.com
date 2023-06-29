"use client";

import React, { SyntheticEvent, useEffect, useState } from "react";
import { Button, Menu, Divider, Image, Icon } from "semantic-ui-react";
import { useMediaQuery } from "react-responsive";

const Navbar: React.FC = () => {
    const [activeMenuItem, setActiveMenuItem] = useState("home");
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => setCollapsed(isMobile), [isMobile]);

    const handleItemClick = (e: SyntheticEvent, data: any) => {
        setActiveMenuItem(data.name);
    };

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
                    <Menu.Item
                        name="home"
                        active={activeMenuItem === "home"}
                        onClick={handleItemClick}
                    >
                        Home
                    </Menu.Item>

                    <Menu.Item
                        name="blog"
                        active={activeMenuItem === "blog"}
                        onClick={handleItemClick}
                    >
                        Blog
                    </Menu.Item>

                    <Menu.Item
                        name="resume"
                        active={activeMenuItem === "resume"}
                        onClick={handleItemClick}
                    >
                        Resume
                    </Menu.Item>
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
