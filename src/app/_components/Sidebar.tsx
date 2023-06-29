import React, { SyntheticEvent, useState } from "react";
import { Button, Menu, Divider, Image, Icon } from "semantic-ui-react";

const Sidebar: React.FC<{ collapsed: boolean }> = (props) => {
    const [activeMenuItem, setActiveMenuItem] = useState("home");

    const handleItemClick = (e: SyntheticEvent, data: any) => {
        setActiveMenuItem(data.name);
    };

    return (
        <Menu
            secondary
            vertical
            className={`flex flex-col content-center !m-0 !rounded-none relative transition-all duration-300 ${
                props.collapsed ? "overflow-hidden !w-0" : ""
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
    );
};

export default Sidebar;
