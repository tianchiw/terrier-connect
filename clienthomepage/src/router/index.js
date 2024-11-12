import {createBrowserRouter, Navigate} from 'react-router-dom'
import Main from '../pages/main'
import Home from '../pages/home'
import Login from '../pages/login'
import Post from '../pages/post'
import NewPost from '../pages/newpost'
import pageOne from '../pages/other/pageOne'
import pageTwo from '../pages/other/pageTwo'
import User from '../pages/user'
import tag1 from '../pages/popular tags/tag1'
import tag2 from '../pages/popular tags/tag2'
import tag3 from '../pages/popular tags/tag3'

import { Children, Component } from 'react'

const routes = [
    {
        path: '/',
        Component: Main,
        children: [
            {
                path: '/',
                element: <Navigate to='home' replace/>
            },
            {
                path: 'home',
                Component: Home,
            },
            {
                path: 'login',
                Component: Login,
            },
            {
                path: 'post',
                Component: Post,
            },
            {
                path: 'newPost',
                Component: NewPost,
            },
            {
                path: 'user',
                Component: User,
            },
            {
                path: 'other',
                children: [
                    {
                        path: 'pageOne',
                        Component: pageOne,
                    },
                    {
                        path: 'pageTwo',
                        Component: pageTwo,
                    },
                ]
            },
            {
                path: 'popular tags',
                children: [
                    {
                        path: 'tag1',
                        Component: tag1,
                    },
                    {
                        path: 'tag2',
                        Component: tag2,
                    },
                    {
                        path: 'tag3',
                        Component: tag3,
                    },
                ]
            },
        ]
    }
]

export default createBrowserRouter(routes)