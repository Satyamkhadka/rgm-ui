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
            },
            {
                name: 'Local Body',
                icon: 'map-marker',
                urlTo: '/local-body',
                briefing: 'Local Body Operations',
                access: '2'
            },
            {
                name: 'SO',
                icon: 'building',
                urlTo: '/so',
                briefing: 'SO operations, Assign staffs to SO',
                access: '2'
            },
            {
                name: 'Scheme',
                icon: 'briefcase',
                urlTo: '/scheme',
                briefing: 'Scheme operations',
                access: '1'
            },
            {
                name: 'Staffs',
                icon: 'users',
                urlTo: '/staff',
                briefing: 'staff operations,assign person under staff'
            },
            {
                name: 'Person',
                icon: 'user',
                urlTo: '/person',
                briefing: 'person operations'
            }, {
                name: 'Project Manager',
                icon: 'user-tie',
                urlTo: '/pm',
                briefing: 'project manager operations, assign SO to PM'
            },
            {
                name: 'Batch',
                icon: 'calendar',
                urlTo: '/batch',
                briefing: 'Batch operations'
            },
            {
                name: 'Generate Contract',
                icon: 'download',
                urlTo: '/',
                briefing: 'Generate Contract'
            },
            {
                name: 'Contracts',
                icon: 'eye',
                urlTo: '/contract',
                briefing: ' See all Contracts'
            }, {
                name: 'Miscellienous',
                icon: 'dollar',
                urlTo: '/misc',
                briefing: ' set miscellienous costs'
            },

        ]

}