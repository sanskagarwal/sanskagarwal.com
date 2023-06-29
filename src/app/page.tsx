"use client";

import React, { useState } from "react";
import {
    Button,
    Menu,
    Divider,
} from "semantic-ui-react";
import MediaQuery from "react-responsive";

import Sidebar from "./_components/Sidebar";

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileCollapsed, setMobileCollapsed] = useState(true);

    return (
        <div className="mx-0 flex flex-row">
            <MediaQuery maxWidth={767}>
                <Sidebar collapsed={mobileCollapsed} />
            </MediaQuery>
            <MediaQuery minWidth={768}>
                <Sidebar collapsed={collapsed} />
            </MediaQuery>
            <div className="min-h-screen flex-auto flex flex-col">
                <Menu secondary className="!mb-0">
                    <Menu.Item>
                        <Button
                            icon="bars"
                            onClick={() => {
                                setCollapsed(!collapsed);
                                setMobileCollapsed(!mobileCollapsed);
                            }}
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
