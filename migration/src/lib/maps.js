
export const blogMap = [
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
                    'Paths': ['Body']
                },
                {
                    'Paths': [
                        'For-More-Information',
                    ],
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
        'SharePointColumn': 'Image',
            'ContentPaths':
        [
            {
                'Paths': ['Image'],
                'Transformation': 'convertImage'
            }
        ]
    },
    {
        'SharePointColumn': 'Tags',
            'ContentPaths':
            [
                {
                    'Paths': ['Blog-Series'],
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
        'SharePointColumn': 'StaticURL',
            'ContentPaths':
        [
            {
                'Paths': ['Path']
            }
        ]
    },
    {
        'SharePointColumn': 'Topics',
            'ContentPaths':
        [
            {
                'Paths': ['Topics']
            }
        ]
    },
    {
        'SharePointColumn': 'Date Posted',
            'ContentPaths':
        [
            {
                'Paths': ['Date-Posted']
            }
        ]
    },
    {
        'SharePointColumn': 'Date Updated',
            'ContentPaths':
        [
            {
                'Paths': ['Date-Updated']
            }
        ]
    }
];


