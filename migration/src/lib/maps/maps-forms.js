
export const formsMap = [
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
        'SharePointColumn': 'Publish_x0020_Date',
        'ContentPaths':
            [
                {
                    'Paths': ['Date-Posted'],
                    'Transformation': 'convertDate'
                }
            ]
    },
    {
        'SharePointColumn': 'Modified',
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
                    'Paths': ['Path'],
                    'Transformation': 'convertURL'
                }
            ],
        'CharacterLimit': 255
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
        'Metadata': 'MigrateAdminUse',
        'ContentPaths':
            [
                {
                    'Paths': ['Admin-use-only']
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


