autowatch = 1;

inlets = 1;
outlets = 2;


var Composition = require('composition');
var Initializer = require('initializer');
var CompositionInterpreter = require('composition_interpreter');

var composition = Composition.getComposition();
var ABELTON_LIVE_SET_DATA_OBJECT = Initializer.initialize();

LIVE_SET = ABELTON_LIVE_SET_DATA_OBJECT.live_set;
CLIP_SLOT_GRID = ABELTON_LIVE_SET_DATA_OBJECT.clip_slot_grid;
RECORDED_CLIP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.recorded_clip_array;

SCENE_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.scene_array;
SCENE_NAME_LOOKUP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.scene_name_lookup_array;

TRACK_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.track_array;
TRACK_NAME_LOOKUP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.track_name_lookup_array;

LAST_INDEX_OF_COMPOSITION = composition.length - 1;
currentStepIndex = 0;
firstStep = true;


// Manually initilize
function initialize() {
    ABELTON_LIVE_SET_DATA_OBJECT = Initializer.initialize();
    // Global Variables
    LIVE_SET = ABELTON_LIVE_SET_DATA_OBJECT.live_set;
    CLIP_SLOT_GRID = ABELTON_LIVE_SET_DATA_OBJECT.clip_slot_grid;
    RECORDED_CLIP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.recorded_clip_array;

    SCENE_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.scene_array;
    SCENE_NAME_LOOKUP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.scene_name_lookup_array;

    TRACK_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.track_array;
    TRACK_NAME_LOOKUP_ARRAY = ABELTON_LIVE_SET_DATA_OBJECT.track_name_lookup_array;
    sendOutStepIndex(currentStepIndex, LAST_INDEX_OF_COMPOSITION);
    sendOutStepInformation('intialized and ready to roll!');
}

function step(direction) {
    if (firstStep) {
        triggerStepInComposition(direction);
        firstStep = false;
        return;
    }

    var tempIndex = currentStepIndex;

    if (tempIndex + direction < 0) {
        return;
    } else if (tempIndex + direction > LAST_INDEX_OF_COMPOSITION) {
        return;
    } else {
        currentStepIndex = currentStepIndex + direction;
    }

    triggerStepInComposition(direction);

}


function triggerStepInComposition(direction) {
    var stepData = composition[currentStepIndex];

    var triggers = stepData.triggers;


    var abeltonGlobalEvents = CompositionInterpreter.getAbeltonGlobalEvents(triggers, LIVE_SET);
    var clipsToFireCoords = CompositionInterpreter.getClipsToFireCoords(triggers, RECORDED_CLIP_ARRAY);
    var clipsToStopCoords = CompositionInterpreter.getClipsToStopCoords(triggers, RECORDED_CLIP_ARRAY);
    var sceneToFire = CompositionInterpreter.getSceneToFire(triggers, SCENE_NAME_LOOKUP_ARRAY);
    var trackModifications = CompositionInterpreter.getTrackModificationArray(triggers, TRACK_NAME_LOOKUP_ARRAY);


    sendOutStepIndex(currentStepIndex, LAST_INDEX_OF_COMPOSITION);
    sendOutStepInformation(stepData.info);


    modifyAbeltonLiveGlobalParams(abeltonGlobalEvents);
    modifyTracks(trackModifications);
    fireScene(sceneToFire);
    stopClips(clipsToStopCoords);
    fireClips(clipsToFireCoords);
}


function fireScene(sceneNumber) {
    if (!sceneNumber) {
        return
    }
    SCENE_ARRAY[sceneNumber].call("fire");
}

function modifyAbeltonLiveGlobalParams(globalAbeltonEventsToTrigger) {
    if (globalAbeltonEventsToTrigger.length < 1) {
        return null;
    }
    globalAbeltonEventsToTrigger.map(function (obj) {
        var keyArray = Object.keys(obj);
        keyArray.map(function (param) {
            LIVE_SET.set(param, obj[param]);
        });
    });
}

function modifyTracks(tracksToModifyArray) {
    if (tracksToModifyArray.length < 1) {
        return
    }
    tracksToModifyArray.map(function (trackModificationData) {
        // post('\n', trackModificationData.trackIndex);
        // post('\n', TRACK_ARRAY.length);
        var liveTrack = TRACK_ARRAY[trackModificationData.trackIndex];
        var keyArray = Object.keys(trackModificationData);
        keyArray.map(function (param) {
            if(trackModificationData[param] === null
                || param == 'instruments'
                || param == 'effects'
                || param == 'trackIndex') {
                return
            }
            liveTrack.set(param, trackModificationData[param]);
        });
    });
}

function fireClips(clipCoords) {
    if (clipCoords.length < 1) {
        return
    }
    clipCoords.map(function (clip) {
        if (!clip) {
            return
        }
        CLIP_SLOT_GRID[clip.x][clip.y].call("fire");
    });
}

function stopClips(clipCoords) {
    if (clipCoords.length < 1) {
        return
    }
    clipCoords.map(function (clip) {
        if (!clip) {
            return
        }
        CLIP_SLOT_GRID[clip.x][clip.y].call("stop");
    })
}

function sendOutStepIndex(current, last) {
    outlet(0, current.toString() + ' / ' + last.toString());
}

function sendOutStepInformation(info) {
    outlet(1, info);
}
