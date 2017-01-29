exports.getAbeltonGlobalEvents = function (triggers) {
    var globalAbeltonEventsToTrigger = [];

    if (!triggers.set) {
        return globalAbeltonEventsToTrigger
    }

    Object.keys(triggers.set).forEach(function(param) {
        var value = triggers.set[param];
        globalAbeltonEventsToTrigger.push(convertToLOMNotation(param, value))
    });

    return globalAbeltonEventsToTrigger;

};

/**
 *
 * @param param
 * @param value
 * @returns {object}
 */
var convertToLOMNotation = function(param, value) {
    var alreadyFormatted = ['overdub', 'groove_amount', 'tempo'];
    if (alreadyFormatted.indexOf(param) !== -1) {
        var obj = {};
        obj[param] = value;
        return obj;
    }
    if (param == 'quantization') {
        return {clip_trigger_quantization: value}
    }
    if (param == 'time') {
        return {current_song_time: value}
    }
    if (param == 'play') {
        return {is_playing: value}
    }
    if (param == 'record') {
        return {record_mode: value}
    }
    if (param == 'signature') {
        return {
            signature_numerator: value[1],
            signature_denominator: value[1]
        }
    }

    post('unknown Abelton Event:', param, 'with value', value);
    return {};

};

/**
 *
 * @param triggers
 * @param SCENE_NAME_LOOKUP_ARRAY
 * @returns {int|null}
 */
exports.getSceneToFire = function (triggers, SCENE_NAME_LOOKUP_ARRAY) {
    if (!triggers.scene) {
        return null
    }

    if (!isNaN(triggers.scene)) {
        return parseInt(triggers.scene);
    }
    if (typeof triggers.scene === 'string') {
        var filteredArray = SCENE_NAME_LOOKUP_ARRAY.filter(function (sceneInfo) {
            post('\n', sceneInfo.name, triggers.scene);
            return sceneInfo.name == triggers.scene
        });
        if (filteredArray.length === 0) {
            post('\n!!-- scene trigger ', triggers.scene, 'does not exist --!!')
        } else if (filteredArray.length > 1) {
            post('\n!! -- scene trigger ', triggers.scene, 'is declared more than once --!!')
        }

        return parseInt(filteredArray[0].location);
    }

    post('\nscene trigger ', triggers.scene, 'should be a number or string')
};

/**
 *
 * @param triggers
 * @param TRACK_NAME_LOOKUP_ARRAY
 * @returns {Array}
 */
// exports.getTracksToModifyIndexArray = function (triggers, TRACK_NAME_LOOKUP_ARRAY) {
//     var trackData = [];
//
//     Object.keys(triggers).forEach(function (triggerType) {
//         if (triggerType === 'tracks') {
//             triggers['tracks'].forEach(function (trackModifications) {
//                 var trackIndexToModify = getTrackObjectIndexByName(trackModifications.name, TRACK_NAME_LOOKUP_ARRAY);
//                 trackData.push(trackIndexToModify);
//             });
//         }
//     });
//
//     return trackData;
// };

/**
 *
 * @param triggers
 * @param TRACK_NAME_LOOKUP_ARRAY
 * @returns {Array}
 */
exports.getTrackModificationArray = function (triggers, TRACK_NAME_LOOKUP_ARRAY) {
    var trackModificationData = [];

    Object.keys(triggers).forEach(function (triggerType) {
        if (triggerType === 'tracks') {
            triggers['tracks'].forEach(function (trackModifications) {
                if (trackModifications.name == 'all') {
                    TRACK_NAME_LOOKUP_ARRAY.forEach(function(entry) {
                        var trackIndexToModify = entry.location;
                        post('\ntrackmods ', trackModifications.mute);
                        trackModificationData.push(sanitizeTrackModificationData(trackIndexToModify, trackModifications));
                    })
                } else {
                    var trackIndexToModify = getTrackObjectIndexByName(trackModifications.name, TRACK_NAME_LOOKUP_ARRAY);
                    trackModificationData.push(sanitizeTrackModificationData(trackIndexToModify, trackModifications));
                }
            });
        }
    });

    return trackModificationData;
};

var sanitizeTrackModificationData = function (trackIndexToModify, trackModifications) {
    return {
        trackIndex: trackIndexToModify,
        arm: isOneOrZero(trackModifications.arm) ? trackModifications.arm : null,
        mute: isOneOrZero(trackModifications.mute) ? trackModifications.mute : null,
        solo: isOneOrZero(trackModifications.solo) ? trackModifications.solo : null,
        instruments: !trackModifications.instruments
            ? []
            : trackModifications.instruments,
        effects: !trackModifications.effects
            ? []
            : trackModifications.effects
    }
};

var isOneOrZero = function(number) {
    if (typeof number !== 'number') {
        return false
    }
    if (number == 0 || number == 1) {
        return true
    }

}
/**
 *
 * @param triggers
 * @param RECORDED_CLIP_ARRAY
 * @returns {Array}
 */
exports.getClipsToFireCoords = function (triggers, RECORDED_CLIP_ARRAY) {
    var clipsToFireCoords = [];

    Object.keys(triggers).forEach(function (triggerType) {
        if (triggerType === 'clips') {
            triggers['clips'].forEach(function (clip) {
                if (clip.off) {
                    // the stop handler deals with these
                    return
                }
                clipsToFireCoords.push(getCoordsOfClip(clip, RECORDED_CLIP_ARRAY));
            });
        }
    });

    return clipsToFireCoords;
};

exports.getClipsToStopCoords = function (triggers, RECORDED_CLIP_ARRAY) {
    var clipsToStopCoords = [];
    Object.keys(triggers).forEach(function (triggerType) {
        if (triggerType === 'clips') {
            triggers['clips'].forEach(function (clipGroup) {
                if (clipGroup.off) {
                    clipGroup.off.forEach(function (clip) {
                        clipsToStopCoords.push(getCoordsOfClip(clip, RECORDED_CLIP_ARRAY));
                    })
                }
            });
        }
    });

    return clipsToStopCoords;
};

var getTrackObjectIndexByName = function (name, TRACK_NAME_LOOKUP_ARRAY) {
    var trackInfoObject = TRACK_NAME_LOOKUP_ARRAY.filter(function (obj) {
        return obj.name == name
    });
    if (trackInfoObject.length > 1) {
        post('\nYou have two tracks named ', name, ' and you should only have one....')
    }
    if (trackInfoObject.length < 1) {
        post('\nYou have no track named ', name, ' :-( ')
    }
    return trackInfoObject[0].location;
};

var getTrackNumber = function (trackNameOrNumber, TRACK_NAME_LOOKUP_ARRAY) {
    if (!isNaN(trackNameOrNumber)) {
        return parseInt(trackNameOrNumber);
    }


};

var getCoordsOfClip = function (clip, RECORDED_CLIP_ARRAY) {
    if (clip.constructor === Array) {
        // just array of coords, no more info given
        return {
            x: clip[0],
            y: clip[1]
        }
    }
    if (typeof clip === 'string') {
        // just the name of the clip and no more info given
        var stringCoords = getRecordedObjectByName(clip, RECORDED_CLIP_ARRAY).location;

        return {
            x: stringCoords[0],
            y: stringCoords[1]
        }
    }
    if (typeof clip === 'object') {
        // a lot of info given about things....
        if (clip.location) {
            var objectCoords = clip.location;
            return {
                x: objectCoords[0],
                y: objectCoords[1]
            }
        }
        if (clip.name) {
            var clipObject = getRecordedObjectByName(clip.name, RECORDED_CLIP_ARRAY);
            if (!clipObject) {
                post('\n no clip nameed: ', clip.name);
            }
            var location = clipObject.location;
            return {
                x: location[0],
                y: location[1]
            }
        }
    }
};

var getRecordedObjectByName = function (name, RECORDED_CLIP_ARRAY) {
    var clipInfoObjectArray = RECORDED_CLIP_ARRAY.filter(function (obj) {
        return obj.name === name
    });
    if (clipInfoObjectArray.length > 1) {
        // Clip Names must be unique
        post('\nYou have two clips named ', name, ' and you should only have one....')
    }
    return clipInfoObjectArray[0];
};
