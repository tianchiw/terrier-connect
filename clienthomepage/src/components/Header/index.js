import React from "react";
import { Input, Flex,  Button, Space, Layout, Avatar, Dropdown } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import './index.css'
import { fontSize } from "@mui/system";
import { collapseMenu } from '../../store/reducers/tab'
import NewPostWindow from "../NewPost";

const { Search } = Input;
const { Header } = Layout;

const onSearch = (value, _e, info) => console.log(info?.source, value);

const logout = () => {}


const items = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer">
          My profile
        </a>
      ),
    },
    {
      key: '2',
      label: (
        <a target="_blank" onClick = {() => logout} rel="noopener noreferrer">
          Log out
        </a>
      ),
    },

  ];


const BCHeader = ({ collapsed }) => {
    const dispatch = useDispatch()
    const setCollapsed = () => {
      console.log(collapsed)
      dispatch(collapseMenu())
    }
    const jumpTo = () => {
      window.location.href = "https://www.google.com"
    }

    return (
        <Header className='header-container'>
                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => {setCollapsed()}}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 32,
                        backgroundColor: '#fff',
                        marginRight: 96
                    }}
                />

            <Search placeholder="input search text" 
                onSearch={onSearch} 
                
                enterButton
                style={{
                    fontSize: '16px',
                    width: 512,
                    height: 32,
                    margin: 176,
                }}/>

            <Button type="primary"style={{
                    fontSize: '16px',
                    width: 96,
                    height: 32,
                    margin: 16,
                }}>Posts</Button>

            <NewPostWindow />

            <Button type="primary"style={{
                    fontSize: '16px',
                    width: 96,
                    height: 32,
                    margin: 16,
                }}>Follower</Button>
            <Dropdown
                menu = {{items}}
            >
            <Avatar size={40} src={<img src={require("../../res/images/user.png")} />} />
            </Dropdown>

        </Header>
    )
}

export default BCHeader