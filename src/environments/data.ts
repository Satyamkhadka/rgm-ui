export const data = {
    roles: {
        user: 0,
        admin: 1,
        superadmin: 2,
    },
    listItems:
        [
            {
                name: 'Home',
                icon: 'home',
                urlTo: '/menu',
                briefing: 'Site map and briefings',
                access: '0'
                , menu: false,
                sidebar: true
            },
            {
                name: 'Local Body',
                icon: 'map-marker',
                urlTo: '/local-body',
                briefing: 'Local Body Operations',
                access: '2'
                , menu: true,
                sidebar: true
            },
            {
                name: 'SO',
                icon: 'building',
                urlTo: '/so',
                briefing: 'SO operations, Assign staffs to SO',
                access: '2'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Scheme',
                icon: 'briefcase',
                urlTo: '/scheme',
                briefing: 'Scheme operations',
                access: '1'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Staffs',
                icon: 'users',
                urlTo: '/staff',
                briefing: 'staff operations,assign person under staff'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Person',
                icon: 'user',
                urlTo: '/person',
                briefing: 'person operations'
                , menu: true,
                sidebar: true
            }, {
                name: 'Project Manager',
                icon: 'user-tie',
                urlTo: '/pm',
                briefing: 'project manager operations, assign SO to PM'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Batch',
                icon: 'calendar',
                urlTo: '/batch',
                briefing: 'Batch operations'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Generate Contract',
                icon: 'download',
                urlTo: '/',
                briefing: 'Generate Contract'
                , menu: true,
                sidebar: false
            },
            {
                name: 'Contracts',
                icon: 'eye',
                urlTo: '/contract',
                briefing: ' See all Contracts'
                , menu: true,
                sidebar: true
            },
            {
                name: 'Create First Payment',
                icon: 'newspaper',
                urlTo: '/payment/first',
                briefing: ' Create first memo of payment to SO'
                , menu: true,
                sidebar: false
            }, {
                name: 'Create Second Payment',
                icon: 'newspaper',
                urlTo: '/payment/second',
                briefing: ' Create second memo of payment to SO'
                , menu: true,
                sidebar: false
            }, {
                name: 'Memorandum first',
                icon: 'newspaper',
                urlTo: '/allmemo/first',
                briefing: ' View all first payment memo'
                , menu: true,
                sidebar: false
            }, {
                name: 'Memorandum second',
                icon: 'newspaper',
                urlTo: '/allmemo/second',
                briefing: ' View all second payment memo'
                , menu: true,
                sidebar: false
            },

            {

                name: 'Miscellienous',
                icon: 'dollar',
                urlTo: '/misc',
                briefing: ' set miscellienous costs'
                , menu: true,
                sidebar: false
            },

        ]

}