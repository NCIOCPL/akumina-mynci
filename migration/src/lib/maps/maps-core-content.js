
export const coreContentMap = [
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
        'SharePointColumn': 'Search_x0020_Description',
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
        'SharePointColumn': 'Departments',
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
        'SharePointColumn': 'Publish_x0020_Date',
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


