
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
        'SharePointColumn': 'EventDate',
        'ContentPaths': [
            {
                'Paths': ['Event-Date']
            }
        ]
    },
    {
        'SharePointColumn': 'Region',
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
                    'Paths': ['Body'],
                    'Transformation': 'convertText'
                },
                {
                    'Paths': ['Videocast-or-Webinar-Link'],
                    'Transformation': 'convertLinksForBody'
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
        'SharePointColumn': 'Search_x0020_Description',
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


