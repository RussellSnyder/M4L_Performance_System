exports.start = {
    name: 'the Beginning 4 real nah',
    triggers: {
        clips: [
            [0, 0],
            {location: [2, 0]},
            {location: [3, 0]},
            {clipName: 'testclip'},
            'anotherTest'
        ]
    }
};

exports.goodPart = {
    name: 'The good part',
    triggers: {
        clips: [
            [0, 1],
            [1, 2],
            [2, 3],
            {location: [2, 4]},
            {clipName: 'introSynth'},
            'shockerSynth'
        ]
    }
};

exports.slowJam = {
    name: 'Slow Jam, do the duggy',
    triggers: {
        clips: [
            [5, 4],
            [4, 3],
            [3, 2],
            {location: [0, 0]},
            {clipName: 'testClip'},
            'anotherTest'
        ]
    }
};

exports.theEnd = {
    name: 'The end, what a great composition',
    triggers: {
        clips: [
            [0, 0],
            [1, 0],
            [2, 0],
            {location: [3, 1]},
            {clipName: 'what?'},
            'no'
        ]
    }
};
