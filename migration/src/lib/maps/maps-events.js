
export const eventsMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['Title']
            }
        ],
        'CharacterLimit': 255
    },
    {
        'SharePointColumn': 'Description',
        'ContentPaths':
            [
                {
                    'Paths': ['Short-Description']
                }
            ]
    },
    {
        'SharePointColumn': 'EventDate',
        'ContentPaths': [
            {
                'Paths': ['Event-Start'],
                'Transformation': 'convertDate'
            }
        ]
    },
    {
        'SharePointColumn': 'EndDate',
        'ContentPaths': [
            {
                'Paths': ['Event-End'],
                'Transformation': 'convertDate'
            }
        ]
    },
    //{
    //    'SharePointColumn': 'Region',
    //    'ContentPaths': [
    //        {
    //            'Paths': ['Campus']
    //        }
    //    ]
    //},
    {
        'SharePointColumn': 'Location',
        'ContentPaths': [
            {
                'Paths': ['Address']
            },
            {
                'Paths': ['Other-Location-Information']
            },
        ],
        'CharacterLimit': 255
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
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPersonForBody'
                },
                {
                    'Paths': ['Address']
                },
                {
                    'Paths': ['Other-Location-Information']
                }
            ],
        'Separator':'<br />'
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
    //{
    //    'SharePointColumn': 'Departments',
    //      'SharePointType': 'TaxMulti',
    //    'ContentPaths':
    //        [
    //            {
    //                'Paths': ['Content-Owner--Organization-'],
    //                'Transformation': 'convertDepartments'
    //            }
    //        ]
    //},
   /* {
        'SharePointColumn': 'PublisherId',
        'ContentPaths':
            [
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPerson'
                }
            ]
    },*/
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
        'SharePointColumn': 'AkLanguageCode',
        'HardcodedData': 'en-US'
    },
    {
        'SharePointColumn': 'AkLanguageId',
        'HardcodedData': '1033'
    }
];


