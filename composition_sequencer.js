autowatch = 1;

inlets = 1;
outlets = 2;


var Composition = require('composition');
var initializer = require('initializer');

var composition = Composition.getComposition();


// Manually initilize
function initialize() {
    initializer.initialize();
}

initializer.initialize();


// Global Variables
CLIP_SLOT_GRID = initializer.CLIP_SLOT_GRID;
RECORDED_CLIP_ARRAY = initializer.RECORDED_CLIP_ARRAY;

lastIndex = composition.length - 1;
stepIndex = 0;
firstStep = true;

// function reset() {
//     stepIndex = 0;
//     firstStep = true;
//     outlet(0, 0 + ' / ' + lastIndex.toString());
//     outlet(1, 'RESET');
//
// }


function step(direction) {
    if (firstStep) {
        triggerStepInComposition(direction);
        firstStep = false;
        return;
    }

    var tempIndex = stepIndex;

    if (tempIndex + direction < 0) {
        post('here');
        return;
    } else if (tempIndex + direction > lastIndex) {
        return;
    } else {
        stepIndex = stepIndex + direction;
    }

    triggerStepInComposition(direction);

}

function triggerClipByName(name) {

}


function triggerStepInComposition(direction) {
    var stepData = composition[stepIndex];
    var triggers = stepData.triggers;


    var clipCoords = [];

    Object.keys(triggers).map(function (triggerType) {
        if (triggerType === 'clips') {
            clipCoords = triggers['clips'].map(function (clip) {
                if (clip.constructor === Array) {
                // just array of coords, no more info given
                    return {
                        x: clip[0],
                        y: clip[1]
                    }
                } else if (typeof clip === 'string') {
                    // just the name of the clip and no more info given
                    var coords = RECORDED_CLIP_ARRAY[clip]['location'];
                    // post('boom', coords[0]);
                    return {
                        x: coords[0],
                        y: coords[1]
                    }
                } else if (typeof clip === 'object') {
                    // a lot of info given about things....
                    if (clip.location) {
                        var coords = clip.location;
                        return {
                            x: coords[0],
                            y: coords[1]
                        }
                    } else if (clip.clipName) {
                        var location = RECORDED_CLIP_ARRAY[clip.clipName]['location'];
                        // post('boom', coords[0]);
                        return {
                            x: location[0],
                            y: location[1]
                        }
                    }
                }
            })
        }
    });


    fireClips(clipCoords);
    // post('\n', triggers[0].name);
    // post('\n', clip.x);
    // post('\n', clip.y);
    // CLIP_SLOT_GRID[clip.x][clip.y].call("fire");
    outlet(0, stepIndex.toString() + ' / ' + lastIndex.toString());
    outlet(1, 'section: ' + stepData.name);
}


function fireClips(clipCoords) {
    // post(clipCoords[0].x);
    // post('length', clipCoords.length);
    clipCoords.map(function (clip) {
        // post('\nclip x:', clip.x)
        // post('\nclip y:', clip.y)
        CLIP_SLOT_GRID[clip.x][clip.y].call("fire");
    })
    // for (i = 0; i < clipCoords.length; i++) {
    //     CLIP_SLOT_GRID[clipCoords[i].x][clipCoords[i].y].call("fire");
    // }
}

function getNameOfTrigger() {

}

// TODO take strings and trigger named clips
function getClipCoords(clip) {
    return {
        x: clip[0],
        y: clip[1],
    }
}

function fireClipSlot(x, y) {
    CLIP_SLOT_GRID[x][y].call("fire");
}

/// we're just gonna initialize everything at the end so we don't have to keep clicking scan:
// scan();
