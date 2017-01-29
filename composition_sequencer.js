autowatch = 1;

inlets = 1;
outlets = 2;


var Composition = require('composition');
var Initializer = require('initializer');
var CompositionInterpreter = require('composition_interpreter');

var composition = Composition.getComposition();
var ALL_CLIPS_IN_LIVE_SET = Initializer.initialize();

CLIP_SLOT_GRID = ALL_CLIPS_IN_LIVE_SET.clip_slot_grid;
RECORDED_CLIP_ARRAY = ALL_CLIPS_IN_LIVE_SET.recorded_clip_array;

SCENE_ARRAY = ALL_CLIPS_IN_LIVE_SET.scene_array;
SCENE_NAME_LOOKUP_ARRAY = ALL_CLIPS_IN_LIVE_SET.scene_name_lookup_array;

TRACK_ARRAY = ALL_CLIPS_IN_LIVE_SET.track_array;
TRACK_NAME_LOOKUP_ARRAY = ALL_CLIPS_IN_LIVE_SET.track_name_lookup_array;

LAST_INDEX_OF_COMPOSITION = composition.length - 1;
currentStepIndex = 0;
firstStep = true;



// Manually initilize
function initialize() {
    ALL_CLIPS_IN_LIVE_SET = Initializer.initialize();
    // Global Variables
    CLIP_SLOT_GRID = ALL_CLIPS_IN_LIVE_SET.clip_slot_grid;
    RECORDED_CLIP_ARRAY = ALL_CLIPS_IN_LIVE_SET.recorded_clip_array;

    SCENE_ARRAY = ALL_CLIPS_IN_LIVE_SET.scene_array;
    SCENE_NAME_LOOKUP_ARRAY = ALL_CLIPS_IN_LIVE_SET.scene_name_lookup_array;

    TRACK_ARRAY = ALL_CLIPS_IN_LIVE_SET.track_array;
    TRACK_NAME_LOOKUP_ARRAY = ALL_CLIPS_IN_LIVE_SET.track_name_lookup_array;
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
        post('here');
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

    var clipsToFireCoords = CompositionInterpreter.getClipsToFireCoords(triggers, RECORDED_CLIP_ARRAY);
    var clipsToStopCoords = CompositionInterpreter.getClipsToStopCoords(triggers, RECORDED_CLIP_ARRAY);
    var sceneToFire = CompositionInterpreter.getSceneToFire(triggers, SCENE_NAME_LOOKUP_ARRAY);
    var trackModifications = CompositionInterpreter.getTrackModificationArray(triggers, TRACK_NAME_LOOKUP_ARRAY);


    sendOutStepIndex(currentStepIndex, LAST_INDEX_OF_COMPOSITION);
    sendOutStepInformation(stepData.info);

    modifyTracks(trackModifications);
    fireScene(sceneToFire);
    stopClips(clipsToStopCoords);
    fireClips(clipsToFireCoords);
    // post('\n', triggers[0].name);
    // post('\n', clip.x);
    // post('\n', clip.y);
    // CLIP_SLOT_GRID[clip.x][clip.y].call("fire");
    // outlet(0, currentStepIndex.toString() + ' / ' + lastIndex.toString());
}


function fireScene(sceneNumber) {
    if (!sceneNumber) { return }
    SCENE_ARRAY[sceneNumber].call("fire");
}

function modifyTracks(tracksToModifyArray) {
    if (tracksToModifyArray.length < 1) { return }
    tracksToModifyArray.map(function(trackModificationData) {
        // post('\n', trackModificationData.trackIndex);
        // post('\n', TRACK_ARRAY.length);
        var liveTrack = TRACK_ARRAY[trackModificationData.trackIndex];
        if (trackModificationData.arm !== null) {
            liveTrack.set('arm', trackModificationData.arm);
        }
        if (trackModificationData.solo !== null) {
            liveTrack.set('solo', trackModificationData.solo);
        }
        post('\nmute: ', trackModificationData.mute, 'track: ', trackModificationData.trackIndex);
        if (trackModificationData.mute !== null) {
            liveTrack.set('mute', trackModificationData.mute);
        }
    });
}

function fireClips(clipCoords) {
    if (clipCoords.length < 1) { return }
    clipCoords.map(function (clip) {
        if (!clip) { return }
        CLIP_SLOT_GRID[clip.x][clip.y].call("fire");
    });
}

function stopClips(clipCoords) {
    if (clipCoords.length < 1) { return }
    clipCoords.map(function (clip) {
        if (!clip) { return }
        CLIP_SLOT_GRID[clip.x][clip.y].call("stop");
    })
}

function sendOutStepIndex(current, last) {
    outlet(0, current.toString() + ' / ' + last.toString());
}

function sendOutStepInformation(info) {
    outlet(1, info);
}
