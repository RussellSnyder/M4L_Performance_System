exports.getClipsToFireCoords = function (triggers, RECORDED_CLIP_ARRAY) {
    var clipsToFireCoords = [];

    Object.keys(triggers).forEach(function (triggerType) {
        if (triggerType === 'clips') {
            triggers['clips'].forEach(function (clip) {
                if(clip.off) {
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
                if(clipGroup.off) {
                    clipGroup.off.forEach(function (clip) {
                        clipsToStopCoords.push(getCoordsOfClip(clip, RECORDED_CLIP_ARRAY));
                    })
                }
            });
        }
    });

    return clipsToStopCoords;
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

var getRecordedObjectByName = function(name, RECORDED_CLIP_ARRAY) {
    var clipInfoObjectArray = RECORDED_CLIP_ARRAY.filter(function(obj) {
        return obj.name === name
    });
    if (clipInfoObjectArray.length > 1) {
        // Clip Names must be unique
        post('\nYou have two clips named ', name, ' and you should only have one....')
    }
    return clipInfoObjectArray[0];
};