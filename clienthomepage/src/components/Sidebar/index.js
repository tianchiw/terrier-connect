import React from 'react'
import HomeSiderBarConfig from '../../config/HomeSiderBarConfig';
import * as Icon from '@ant-design/icons';
import {Button, Layout, Menu, theme, Typography } from 'antd';

const { Sider } = Layout;
const { Title, Text } = Typography;
const iconStrToElement = (name) => React.createElement(Icon[name])

const sidebarItems = HomeSiderBarConfig.map((item) => {
    //No child menu
    const child = {
        key: item.path,
        icon: iconStrToElement(item.icon),
        label: item.label
    }

    //have child menu
    if (item.children){
        child.children = item.children.map(subitem => {
            return {
                key: subitem.path,
                label: subitem.label
            }
        }
        )
    }
    return child
})

const SideBar = ({collapsed}) => {
    return (
        <Sider trigger={null} collapsible
            collapsed = {collapsed}>
            <h3 className='app-name'>{ collapsed ? 'TC' : 'TerrierConnect'}</h3>

            <Menu
                theme="dark"
                mode="inline"
                defaultSelectedKeys={['1']}
                items={sidebarItems}
                style={{
                    height:'260%'
                }}
            />
        </Sider>
    )
}

export default SideBar