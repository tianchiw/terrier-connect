import React from "react";
import { Button, Space, Layout, Avatar, Dropdown, Menu, theme } from 'antd';
import { MenuFoldOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux'
import { fontSize } from "@mui/system";

const { Content } = Layout;

const MainContent = () => {
    return (
        <Content
        style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
        }}>
            Content
            <Space align="center">
            <Button
                type = "text"
                icon = {<MenuFoldOutlined/>}
                style = {{
                    fontSize: '16px',
                    width: 64,
                    height: 32,
                    backgroundColor: '#fff'
                }}
            />

            <Button
                type = "text"
                icon = {<MenuFoldOutlined/>}
                style = {{
                    fontSize: '16px',
                    width: 64,
                    height: 32,
                    backgroundColor: '#fff'
                }}
            />
            </Space>
            <Avatar size={36} src={<img src={require("../../res/images/user.png")} />} />
        </Content>
    )
}

export default MainContent