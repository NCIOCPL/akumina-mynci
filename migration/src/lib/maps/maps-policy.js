
export const policyMap = [
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
                    'Paths': ['For-More-Information'],
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


