var Sections = require('composition_sections');


exports.getComposition = function () {
    return [
        Sections.getSection('gravity', 'trigger scene 6'),
        Sections.getSection('transfer', 'trigger section2'),
        Sections.getSection('gravity', 'trigger scene 6 again'),
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