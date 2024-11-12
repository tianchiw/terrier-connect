export default [
    {
        path: '/home',
        name: 'home',
        label: 'o Main o',
        icon: 'HomeOutlined',
        url: '/home/index'
    },
    {
        path: '/post',
        name: 'post',
        label: 'popular Tags',
        icon: 'ShopOutlined',
        url: '/mail/index',
        children: [
            {
                path: '/popular tags/tag1',
                name: 'Tag1',
                label: 'Tag1',
                icon: 'SettingOutlined'
            },
            {
                path: '/popular tags/tag2',
                name: 'Tag2',
                label: 'Tag2',
                icon: 'SettingOutlined'
            },
            {
                path: '/popular tags/tag3',
                name: 'Tag3',
                label: 'Tag3',
                icon: 'SettingOutlined'
            }
            ]
    },
    {
        path: '/user',
        name: 'user',
        label: 'User Management',
        icon: 'UserOutlined',
        url: '/user/index'
    },
    {
        path: '/other',
        label: 'Others',
        icon: 'SettingOutlined',
        children: [
        {
            path: '/other/pageOne',
            name: 'page1',
            label: 'page1',
            icon: 'SettingOutlined'
        },
        {
            path: '/other/pageTwo',
            name: 'page2',
            label: 'page2',
            icon: 'SettingOutlined'
        }
        ]
    }
]