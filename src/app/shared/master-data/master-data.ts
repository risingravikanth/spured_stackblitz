export const SECTIONS = [
    {
        "title": "Topics",
        "select": false,
        "sections": [
            {
                "name": "Verbal",
                "code": "VERBAL",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    },
                    {
                        "name": "CAT",
                        "code": "cat"
                    },
                    {
                        "name": "GMAT",
                        "code": "gmat"
                    },
                    {
                        "name": "MAT",
                        "code": "mat"
                    },
                    {
                        "name": "GRE",
                        "code": "gre"
                    },
                    {
                        "name": "TOFEL",
                        "code": "tofel"
                    },
                    {
                        "name": "Railway",
                        "code": "railway"
                    },
                    {
                        "name": "Banks",
                        "code": "banks"
                    },
                    {
                        "name": "Others",
                        "code": "others"
                    }
                ]
            },
            {
                "name": "Quants",
                "code": "QUANTS",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    },
                    {
                        "name": "CAT",
                        "code": "cat"
                    },
                    {
                        "name": "GMAT",
                        "code": "gmat"
                    },
                    {
                        "name": "MAT",
                        "code": "mat"
                    },
                    {
                        "name": "GRE",
                        "code": "gre"
                    },
                    {
                        "name": "TOFEL",
                        "code": "tofel"
                    },
                    {
                        "name": "Railway",
                        "code": "railway"
                    },
                    {
                        "name": "Banks",
                        "code": "banks"
                    },
                    {
                        "name": "Others",
                        "code": "others"
                    }
                ]
            },
            {
                "name": "General Knowledge",
                "code": "GK",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    },
                    {
                        "name": "Railway",
                        "code": "railway"
                    },
                    {
                        "name": "Banks",
                        "code": "banks"
                    },
                    {
                        "name": "Others",
                        "code": "others"
                    }
                ]
            },
            {
                "name": "Careers",
                "code": "CAREERS",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    },
                    {
                        "name": "Jobs",
                        "code": "jobs"
                    }
                ]
            },
            {
                "name": "Events",
                "code": "EVENTS",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    },
                    {
                        "name": "Cultural",
                        "code": "cultural"
                    },
                    {
                        "name": "Technical",
                        "code": "technical"
                    },
                    {
                        "name": "Management",
                        "code": "management"
                    },
                    {
                        "name": "Sports",
                        "code": "sports"
                    },
                    {
                        "name": "Fun",
                        "code": "fun"
                    },
                    {
                        "name": "Others",
                        "code": "others"
                    }
                ]
            },
            {
                "name": "News",
                "code": "NEWS",
                "categories": [
                    {
                        "name": "HOME",
                        "code": "home"
                    }
                ]
            }
        ]
    }
    // ,
    // {
    //   "title": "Boards",
    //   "select": false,
    //   "sections": [
    //     {
    //       "name": "Open",
    //       "code": "open",
    //       "categories": [
    //         {
    //           "name": "HOME",
    //           "code": "home"
    //         },
    //         {
    //           "name": "JNTU Kakinada",
    //           "code": "jntuk"
    //         },
    //         {
    //           "name": "RGUKT CSE 2000-03",
    //           "code": "1132"
    //         }
    //       ]
    //     },
    //     {
    //       "name": "Close",
    //       "code": "close",
    //       "categories": [
    //         {
    //           "name": "HOME",
    //           "code": "home"
    //         },
    //         {
    //           "name": "RGUKT Nuzivid",
    //           "code": "rgukt-nzv"
    //         },
    //         {
    //           "name": "RGUKT Nuzivid CSE",
    //           "code": "rgukt-cse"
    //         },
    //         {
    //           "name": "RGUKT Nuzivid 2000-03",
    //           "code": "rgukt-2000-03"
    //         },
    //         {
    //           "name": "RGUKT Nuzivid CSE 2000-03",
    //           "code": "211"
    //         }
    //       ]
    //     }
    //   ]
    // }
]



export const TYPES = [
    { label: 'Verbal', value: 'VERBAL' },
    { label: 'Quants', value: 'QUANTS' },
    { label: 'Events', value: 'EVENTS' },
    { label: 'Careers', value: 'CAREERS' },
    { label: 'News', value: 'NEWS' }
]

export const CATEGORIES = [

]

export const MODELS = [
    { label: 'Aptitude', value: 'aptitude' },
    { label: 'Reasoning', value: 'reasoning' }
]

export const AUDIENCE = [
    { name: 'Computers', value: 'CSE' },
    { label: 'Eletronics', value: 'ECE' },
    { label: 'IT', value: 'IT' },
    { label: 'MECH', value: 'MECH' },
    { label: 'Chemical', value: 'CHEM' }
];

export const SECTION_MAPPINGS = [
    { section: 'VERBAL', _type: 'VerbalPost' },
    { section: 'QUANTS', _type: 'QuantsPost' },
    { section: 'EVENTS', _type: 'EventsPost' },
    { section: 'CAREERS', _type: 'CareerPost' },
];