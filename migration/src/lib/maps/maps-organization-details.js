
export const organizationDetailsMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['Title']
            }
        ]
    },
    {
        'SharePointColumn': 'Body',
        'ContentPaths':
            [
                {
                    'Paths': ['Body'],
                    'Transformation': 'convertText'
                },
                {
                    'Paths': ['Phone']
                },
                {
                    'Paths': ['E-mail']
                },
                {
                    'Paths': ['Website-URL']
                },
                {
                    'Paths': ['For-More-Information'],
                    'Transformation': 'convertLink'
                },
                {
                    'Paths': ['Twitter'],
                    'Transformation': 'convertLink'
                },
                {
                    'Paths': ['Facebook'],
                    'Transformation': 'convertLink'
                },
                {
                    'Paths': ['LinkedIn'],
                    'Transformation': 'convertLink'
                }

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
        'SharePointColumn': 'StaticURL',
        'ContentPaths':
            [
                {
                    'Paths': ['Path']
                }
            ]
    }
];


