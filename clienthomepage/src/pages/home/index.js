import React from 'react'
import { Col, Row, Card, Layout, theme, Typography } from 'antd'
import './home.css'

const {Content} = Layout
const { Title } = Typography;

const Home = () => {
    const userImg = require("../../res/images/user.png")
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    return (
        <Layout>
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
    
    
        <Row className='home'>
            <Col span={8}>
            <Card>
                <div className='user'>
                    <img src={userImg} />
                    <div className='userinfo'>
                        <p className='name'> Username</p>
                        <p className='access'> User</p>
                    </div>
                </div>
                <div className='login-info'>
                    <p>Last Login Time: <span>2024-11-6</span></p>
                    <p>Last Login Address: <span>Boston</span></p>
                </div>
            </Card>
            </Col>
            <Col span={16}> </Col>
        </Row>
        </Content>

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
    )
}

export default Home