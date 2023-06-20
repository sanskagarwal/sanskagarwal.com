"use client";

import React, { useState } from "react";
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    GithubOutlined,
    BugOutlined,
} from "@ant-design/icons";
import { FiSun, FiMoon, FiFileText, FiEdit } from "react-icons/fi";
import { Avatar, Button, Col, Divider, Layout, Menu, Row, theme } from "antd";

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
                breakpoint="md"
                trigger={null}
                collapsedWidth="0"
                collapsed={collapsed}
                collapsible={true}
                onBreakpoint={(broken) => {
                    setCollapsed(broken);
                }}
                className={styles.sidebarStyle}
            >
                <Avatar
                    style={{ marginTop: 64 }}
                    size={{
                        xs: 32,
                        sm: 40,
                        md: 64,
                        lg: 72,
                        xl: 80,
                        xxl: 100,
                    }}
                    src="./me.png"
                    className={styles.centerBlock}
                />
                <p style={{ textAlign: "center" }}>Sanskar Agarwal</p>
                <Divider />
                <Menu
                    style={{ borderRight: "none" }}
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={["1"]}
                    items={[
                        {
                            key: "1",
                            icon: <UserOutlined />,
                            label: "Home",
                        },
                        {
                            key: "2",
                            icon: <FiEdit />,
                            label: "Blog",
                        },
                        {
                            key: "3",
                            icon: <FiFileText />,
                            label: "Resume",
                        },
                    ]}
                />
                <div className={styles.alignBottom}>
                    <Divider />
                    <Row justify="center" align="middle">
                        <Col span={6}>
                            <Button
                                type="text"
                                icon={<InstagramOutlined />}
                                size="large"
                            />{" "}
                        </Col>
                        <Col span={6}>
                            <Button
                                type="text"
                                icon={<LinkedinOutlined />}
                                size="large"
                            />{" "}
                        </Col>

                        <Col span={6}>
                            <Button
                                type="text"
                                icon={<GithubOutlined />}
                                size="large"
                            />{" "}
                        </Col>
                    </Row>
                </div>
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
                            marginLeft: "10px",
                        }}
                        size="large"
                    />
                    <div className={styles.alignRight}>
                        <Button
                            type="text"
                            icon={<BugOutlined />}
                            size="large"
                        />
                        <Button
                            type="text"
                            icon={<FiSun />}
                            size="large"
                            className={styles.antDesignIcon}
                        />
                    </div>
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
