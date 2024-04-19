
export const fileMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['Title'],
                'Transformation': 'convertTitle'
            }
        ],
        'CharacterLimit': 255
    },
    {
        'SharePointColumn': 'Name',
        'ContentPaths':
            [
                {
                    'Paths': ['Title'],
                    'Transformation': 'convertTitle'
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
                },
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPersonForBody'
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
        'SharePointColumn': 'File',
        'ContentPaths':
            [
                {
                    'Paths': ['Upload-File']
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
        'SharePointType': 'TaxMulti',
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
        'SharePointType': 'TaxMulti',
            'ContentPaths':
            [
                {
                    'Paths': ['Content-Owner--Organization-'],
                    'Transformation': 'convertDepartments'
                }
            ]
    },
    {
        'SharePointColumn': 'PublisherId',
            'ContentPaths':
        [
            {
                'Paths': ['Contact-for-this-Content'],
                'Transformation': 'convertPerson'
            }
        ]
    },
    {
        'SharePointColumn': 'Date_x0020_Posted',
            'ContentPaths':
        [
            {
                'Paths': ['Date-Posted'],
                'Transformation': 'convertDate'
            }
        ]
    },
    {
        'SharePointColumn': 'Date_x0020_Updated',
            'ContentPaths':
        [
            {
                'Paths': ['Date-Updated'],
                'Transformation': 'convertDate'
            }
        ]
    },
    {
        'SharePointColumn': 'StaticUrl',
        'ContentPaths':
            [
                {
                    'Paths': ['Path']
                }
            ],
        'CharacterLimit': 255
    },
    {
        'Metadata': 'OldPath',
        'ContentPaths':
            [
                {
                    'Paths': ['Upload-File'],
                    'Transformation': 'convertToSlug'
                }
            ]
    },
    {
        'Metadata': 'ExistingPath',
        'ContentPaths':
            [
                {
                    'Paths': ['Upload-File'],
                    'Transformation': 'convertFilePath'
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


