
export const organizationDetailsMap = [
    {
        'SharePointColumn': 'Title',
        'ContentPaths': [
            {
                'Paths': ['Title'],
                'Transformation': 'convertOrgTitleToAcronym'
            }
        ]
    },
    {
        'SharePointColumn': 'Body',
        'ContentPaths':
            [
                {
                    'Paths': ['Title'],
                    'Transformation': 'convertTitleForBody'
                },
                {
                    'Paths': ['Body'],
                    'Transformation': 'convertText'
                },
                {
                    'Paths': ['For-More-Information'],
                    'Transformation': 'convertForMoreInformationLinks'
                },
                {
                    'Paths': ['Phone'],
                    'Transformation': 'convertPrependPhone'
                },
                {
                    'Paths': ['E-mail'],
                    'Transformation': 'convertLinkPrependEmail'
                },
                {
                    'Paths': ['Website-URL'],
                    'Transformation': 'convertLinkPrependWebsite'
                },
                {
                    'Paths': ['Twitter'],
                    'Transformation': 'convertTextLink'
                },
                {
                    'Paths': ['Facebook'],
                    'Transformation': 'convertTextLink'
                },
                {
                    'Paths': ['LinkedIn'],
                    'Transformation': 'convertTextLink'
                }

            ],
        'Separator':'<br />',
        'ContactHeader':'Contact Information'
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
        'SharePointColumn': 'ContentTypeId',
        'HardcodedData': 'GenericHTML'
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


