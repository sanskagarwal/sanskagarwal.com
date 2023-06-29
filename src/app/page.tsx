"use client";

import React, { useEffect, useState } from "react";
import { Button, Menu, Divider } from "semantic-ui-react";
import { useMediaQuery } from "react-responsive";

import Sidebar from "./_components/Sidebar";

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    useEffect(() => setCollapsed(isMobile), [isMobile]);

    return (
        <div className="mx-0 flex flex-row">
            <Sidebar collapsed={collapsed} />
            <div className="min-h-screen flex-auto flex flex-col">
                <Menu secondary className="!mb-0">
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
                <div className="my-4 p-4">Work in Progress!</div>
            </div>
        </div>
    );
};

export default Home;
