var Sections = require('composition_sections');


exports.getComposition = function () {
    return [
        Sections.getSection('gravity', 'this time with Synth'),
        Sections.getSection('transfer', 'watch out for that thing'),
        Sections.getSection('gravity', 'build up'),
        Sections.getSection('transfer'),
        Sections.getSection('gravity'),
        Sections.getSection('transfer'),
        Sections.getSection('gravity'),
        Sections.getSection('legitRock'),
        Sections.getSection('skank'),
        Sections.getSection('legitRock'),
        Sections.getSection('skank'),
        Sections.getSection('legitRock')
    ]
}