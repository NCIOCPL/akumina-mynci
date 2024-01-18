
export const eventsMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['Title']
            }
        ]
    },
    {
        'SharePointColumn': 'Event Date',
        'ContentPaths': [
            {
                'Paths': ['Event-Date']
            }
        ]
    },
    {
        'SharePointColumn': 'Campus',
        'ContentPaths': [
            {
                'Paths': ['Campus']
            }
        ]
    },
    {
        'SharePointColumn': 'Location',
        'ContentPaths': [
            {
                'Paths': ['Address']
            },
            {
                'Paths': ['Other-Location-Information']
            },
        ]
    },
    {
        'SharePointColumn': 'Body',
        'ContentPaths':
            [
                {
                    'Paths': ['Attendance-Restriction']
                },
                {
                    'Paths': ['Event-Sponsor--Outside-NCI-']
                },
                {
                    'Paths': ['Body']
                },
                {
                    'Paths': ['Videocast-or-Webinar-Link'],
                    'Transformation': 'convertLink'
                },
                {
                    'Paths': ['Special-Instructions-for-Videocast-or-Webinar']
                },
                {
                    'Paths': ['Type-of-CME-CEU-Credit-Offered']
                },
                {
                    'Paths': ['CME-CEU-Credit-Hours']
                },
            ],
        'Separator':'<br />'
    },
    {
        'SharePointColumn': 'Search Description',
        'ContentPaths':
            [
                {
                    'Paths': ['Short-Description']
                }
            ]
    },
    {
        'SharePointColumn': 'Tags',
        'ContentPaths':
            [
                {
                    'Paths': ['Topics'],
                    'Transformation': 'convertTags'
                }
            ]
    },
    {
        'SharePointColumn': 'Department',
        'ContentPaths':
            [
                {
                    'Paths': ['Content-Owner--Organization-'],
                    'Transformation': 'convertDepartments'
                }
            ]
    },
    {
        'SharePointColumn': 'Publisher',
        'ContentPaths':
            [
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPerson'
                }
            ]
    },
    {
        'SharePointColumn': 'Publish Date',
        'ContentPaths':
            [
                {
                    'Paths': ['Date-Posted']
                }
            ]
    },
    {
        'SharePointColumn': 'Modified',
        'ContentPaths':
            [
                {
                    'Paths': ['Date-Updated']
                }
            ]
    },
    {
        'SharePointColumn': 'StaticURL',
        'ContentPaths':
            [
                {
                    'Paths': ['Path']
                }
            ]
    }
];


