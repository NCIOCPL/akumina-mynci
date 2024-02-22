
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
                    'Transformation': 'convertLinksForBody'
                },
                {
                    'Paths': ['Twitter'],
                    'Transformation': 'convertLinksForBody'
                },
                {
                    'Paths': ['Facebook'],
                    'Transformation': 'convertLinksForBody'
                },
                {
                    'Paths': ['LinkedIn'],
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


