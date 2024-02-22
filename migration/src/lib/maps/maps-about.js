
export const aboutMap = [
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
                    'Paths': [
                        'For-More-Information',
                    ],
                    'Transformation': 'convertLinksForBody'
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
                    'Paths': ['Path'],
                    'Transformation': 'convertURL'
                }
            ]
    },
    {
        'Metadata': 'OldPath',
        'ContentPaths':
            [
                {
                    'Paths': ['Path']
                }
            ]
    },
    {
        'SharePointColumn': 'AkLanguageCode',
        'HardcodedData': 'en-US'
    },
    {
        'SharePointColumn': 'AkLanguageId',
        'HardcodedData': '1033'
    }
];


