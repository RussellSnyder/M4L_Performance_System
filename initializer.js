exports.initialize = function() {
    var myExports = {
        'clip_slot_grid': [],
        'recorded_clip_array': [],
        'scene_array': [],
        'scene_name_lookup_array': [],
        'track_array': [],
        'track_name_lookup_array': []
    };

    var root = new LiveAPI(this.patcher, "live_set");
    var num_scenes = root.getcount("scenes");
    var num_tracks = root.getcount("tracks");

    for (x = 0; x < num_tracks; x++) {
        var track = new LiveAPI(this.patcher, "live_set", "tracks", x)
        myExports.track_array[x] = track;
        myExports.track_name_lookup_array.push({
            name: track.get('name'),
            location: x
        });

        myExports.clip_slot_grid[x] = [];
    }

    for (y = 0; y < num_scenes; y++) {
        var scene = new LiveAPI(this.patcher, "live_set", "scenes", y);
        myExports.scene_array[y] = scene;
        myExports.scene_name_lookup_array.push({
            name: scene.get('name'),
            location: y
        })
    }

    for (x = 0; x < num_tracks; x++) {
        for (y = 0; y < num_scenes; y++) {
            myExports.clip_slot_grid[x][y] = new LiveAPI(this.patcher, "live_set", "tracks", x, "clip_slots", y);
            if (myExports.clip_slot_grid[x][y].get('clip')[1] !== 0) {
                var clip = new LiveAPI(this.patcher, "live_set", "tracks", x, "clip_slots", y, 'clip');
                var name = clip.get('name');
                // WHY is name an Array? FUCK!!!
                myExports.recorded_clip_array.push({
                    name: name[0],
                    location: [x, y]
                });
            }
        }
    }

    post('\n ---- Initialized ----');

    return myExports;

};