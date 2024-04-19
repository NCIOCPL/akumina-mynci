
export const mediaImagesMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['File-Name'],
                'Transformation': 'convertTitle'
            }
        ],
        'CharacterLimit': 255
    },
    {
        'SharePointColumn': 'OData__x0024_Resources_x003a_core_x002c_Title_x003b_',
        'ContentPaths':
            [
                {
                    'Paths': ['File-Name'],
                    'Transformation': 'convertTitle'
                }
            ],
        'CharacterLimit': 255
    },
    {
        'SharePointColumn': 'Description',
            'ContentPaths':
        [
            {
                'Paths': ['Alt-Text']
            }
        ]
    },
    {
        'SharePointColumn': 'Name',
        'ContentPaths':
            [
                {
                    'Paths': ['File-Name']
                }
            ]
    },
    {
        'SharePointColumn': 'Created',
            'ContentPaths':
        [
            {
                'Paths': ['Upload-Date'],
                'Transformation': 'convertDate'
            }
        ]
    },
    /*{
        'SharePointColumn': 'StaticUrl',
        'ContentPaths':
            [
                {
                    'Paths': ['Path'],
                    'Transformation': 'convertURL'
                }
            ],
        'CharacterLimit': 255
    },*/
    {
        'Metadata': 'OldPath',
        'ContentPaths':
            [
                {
                    'Paths': ['Path'],
                    'Transformation': 'convertToSlug'
                }
            ]
    },
    {
        'Metadata': 'ExistingPath',
        'ContentPaths':
            [
                {
                    'Paths': ['Path'],
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


