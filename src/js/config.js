define(["knockout", "moment"], function(ko, moment)
{
    rightNow = ko.observable();

    // Update rightNow every second
    setInterval(function() {
        rightNow(moment());
    }, 1000);

    return {
        rightNow: rightNow,
        storageKeys: {
            note: "KnowledgePad-note-",
            noteIds: "KnowledgePad-note-ids",
            openNoteIds: "KnowledgePad-openNote-ids"
        }
    };
})