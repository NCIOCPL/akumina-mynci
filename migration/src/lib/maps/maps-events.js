
export const eventsMap = [
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
        'SharePointColumn': 'EventTitle',
        'ContentPaths': [
            {
                'Paths': ['Title'],
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
                    'Transformation': 'convertTextLinkSingleLine'
                },
                {
                    'Paths': ['Special-Instructions-for-Videocast-or-Webinar'],
                    'Transformation': 'convertTextAddEm'
                },
                {
                    'Paths': ['Type-of-CME-CEU-Credit-Offered']
                },
                {
                    'Paths': ['CME-CEU-Credit-Hours']
                },
                {
                    'Paths': ['Address'],
                    'Transformation': 'convertAddress'
                },
                {
                    'Paths': ['Other-Location-Information']
                }
            ],
        'Separator':'<br />'
    },
    {
        'SharePointColumn': 'NCIContactPerson1Id',
        'ContentPaths':
            [
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPersonForContactOne'
                }
            ]
    },
    {
        'SharePointColumn': 'NCIContactPerson2Id',
        'ContentPaths':
            [
                {
                    'Paths': ['Contact-for-this-Content'],
                    'Transformation': 'convertPersonForContactTwo'
                }
            ]
    },
    {
        'SharePointColumn': 'Region',
        'SharePointType': 'TaxMulti',
        'ContentPaths':
            [
                {
                    'Paths': ['Campus'],
                    'Transformation': 'convertRegion'
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
        'SharePointColumn': 'Departments',
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
        'SharePointColumn': 'NCIOrgOwner',
        'SharePointType': 'TaxMulti',
        'ContentPaths':
            [
                {
                    'Paths': ['Content-Owner--Organization-'],
                    'Transformation': 'convertTags'
                }
            ]
    },
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
    },
    {
        'SharePointColumn': 'ContentTypeId',
        'HardcodedData': 'Calendar'
    },
    {
        'SharePointColumn': 'Persona_0',
        'HardcodedData': 'All'
    },
    {
        'SharePointColumn': 'Featured',
        'HardcodedData': 'true'
    },
];


