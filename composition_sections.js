var sections = {
    gravity: {
        info: 'the Beginning 4 real nah',
        triggers: {
            // clips: [
            //     [0, 0],
            //     {location: [1, 0]},
            //     {location: [3, 0]},
            //     {name: 'testclip'},
            //     'anotherTest',
            //     {name: 'turnMeOff'}
            // ],
            scene: 6,
            tracks: [
                {
                    name: 'all',
                    mute: 0
                },
                {
                    name: 'track 3',
                    mute: 0,
                    instruments: [
                        {
                            name: 'test instrument',
                            active: 1
                        }
                    ],
                    effects: [
                        {
                            name: 'test effect',
                            active: 1
                        }
                    ]
                }
            ],
            set: {
                quantization: 0,
                time: 0,
                play: 1,
                groove_amount: 0,
                overdub: 0,
                record: 1,
                tempo: 315,
                signature: [7, 8]
            }
        }
    },

    transfer: {
        info: 'The good part',
        triggers: {
            // clips: [
            //     [0, 1],
            //     [1, 2],
            //     {name: 'introSynth'},
            //     'shockerSynth',
            //     {
            //         off: [
            //             [0, 0],
            //             {name: 'turnMeOff'}
            //         ]
            //     }
            // ],
            scene: 'section2',
            tracks: [
                {
                    name: 'all',
                    mute: 1
                }
                // {
                //     name: 'track one',
                //     mute: 1
                // },
                // {
                //     name: 'track two',
                //     solo: 1
                // }
            ],
            set: {
                quantization: 4,
                time: 4,
                play: 0,
                groove_amount: 0,
                overdub: 0,
                record: 0,
                tempo: 215,
                signature: [3, 4]
            }
        }
    },

    legitRock: {
        info: 'Slow Jam, do the duggy',
        triggers: {
            clips: [
                [0, 1],
                [1, 2],
                {name: 'introSynth'},
                'shockerSynth',
                {
                    off: [
                        [0, 0],
                        {name: 'turnMeOff'}
                    ]
                }
            ]
        }
    },

    skank: {
        info: 'skank',
        triggers: {
            clips: [
                [0, 0],
                {location: [1, 0]},
                {location: [3, 0]},
                {name: 'testclip'},
                'anotherTest',
                {name: 'turnMeOff'}
            ]
        }
    }
};

exports.getSection = function (nameOfSection, extraInformation) {
    var mySection = sections[nameOfSection];

    if (!mySection) {
        post('\n !!!-- no section named: ', nameOfSection + ' --!!')
    }

    if (extraInformation) {
        mySection.info = mySection.info + ': ' + extraInformation
    }

    return mySection
};
