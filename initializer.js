var clip_slot_grid = new Array();
var recorded_clip_array = new Array();


exports.CLIP_SLOT_GRID = clip_slot_grid;
exports.RECORDED_CLIP_ARRAY = recorded_clip_array;

exports.initialize = function() {
    root = new LiveAPI(this.patcher, "live_set");
    num_scenes = root.getcount("scenes");
    num_tracks = root.getcount("tracks");

    for (x = 0; x < num_tracks; x++) {
        clip_slot_grid[x] = new Array();
    }

    for (x = 0; x < num_tracks; x++) {
        for (y = 0; y < num_scenes; y++) {
            clip_slot_grid[x][y] = new LiveAPI(this.patcher, "live_set", "tracks", x, "clip_slots", y);
            // post('\n', typeof clip_slot_grid[x][y].get('clip')[1]);
            // post(clip_slot_grid[x][y].get('clip')[1] !== 0);
            if (clip_slot_grid[x][y].get('clip')[1] !== 0) {
                var clip = new LiveAPI(this.patcher, "live_set", "tracks", x, "clip_slots", y, 'clip');
                recorded_clip_array[clip.get('name')] = clip;
                recorded_clip_array[clip.get('name')]['location'] = [x, y];
            }
        }
    }
}
