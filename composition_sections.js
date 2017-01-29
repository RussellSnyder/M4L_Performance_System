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
            scene: 6
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
            scene: 'section2'
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
