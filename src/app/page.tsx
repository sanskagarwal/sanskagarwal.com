"use client";

import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Divider, Layout, Menu, theme } from "antd";

import styles from "./styles.module.css";

const { Header, Sider, Content, Footer } = Layout;

const Home: React.FC = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    return (
        <Layout className={styles.layout}>
            <Sider
                theme="light"
                trigger={null}
                collapsible
                collapsed={collapsed}
            >
                <div style={{ textAlign: "center" }}>
                    <Avatar
                        style={{ display: "block", margin: "0 auto" }}
                        size={{
                            xs: 32,
                            sm: 40,
                            md: 64,
                            lg: 80,
                            xl: 100,
                            xxl: 120,
                        }}
                        src="./me.png"
                    />
                    <p>Sanskar Agarwal</p>
                </div>
                <Divider />
                <Menu
                    style={{
                        height: "100%",
                    }}
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <UserOutlined />,
                            label: "nav 1",
                        },
                        {
                            key: "2",
                            icon: <VideoCameraOutlined />,
                            label: "nav 2",
                        },
                        {
                            key: "3",
                            icon: <UploadOutlined />,
                            label: "nav 3",
                        },
                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>
                <Divider style={{ margin: 0 }} />
                <Content
                    style={{
                        margin: 0,
                        padding: 24,
                        background: colorBgContainer,
                    }}
                >
                    Work in Progress!
                </Content>
            </Layout>
        </Layout>
    );
};

export default Home;
