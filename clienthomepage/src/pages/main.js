import React, { useState} from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Typography } from 'antd';
import BCHeader from '../components/Header';
import SideBar from '../components/Sidebar';
import { Outlet } from 'react-router-dom'
import { typographyClasses } from '@mui/material';
import { useSelector } from 'react-redux';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const Main = () => {
    //const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    //Get the state of foldout
    const collapsed = useSelector(state => state.tab.isCollapse)
    return (
        <Layout>
            <SideBar collapsed={collapsed}/>
            <Layout>
                <BCHeader collapsed={collapsed}/>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 20,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        height: '16%'
                    }}
                >
                    <Title level={2}> Important Information </Title>                
                </Content>

                <Outlet />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        height: '100%'
                    }}
                >
                    <Title level={2}> Content2 </Title>
                   
                </Content>
            </Layout>
        </Layout>
    );
}

export default Main