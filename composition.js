var Sections = require('composition_sections');


exports.getComposition = function () {
    return [
        Sections.start,
        Sections.goodPart,
        Sections.start,
        Sections.goodPart,
        Sections.slowJam,
        Sections.goodPart,
        Sections.theEnd
    ]
}