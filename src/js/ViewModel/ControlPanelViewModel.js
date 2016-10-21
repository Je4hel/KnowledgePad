define(["knockout", "moment", "Model/NoteModel", "config"], function(ko, moment, Note, config)
{
    "use strict";
    var self = {};

    self.notes = ko.observableArray();
    self.openNoteIds = ko.observableArray();
    self.searchQuery = ko.observable();

    // Computed properties
    self.openNotes = ko.pureComputed(function() {
        return self.notes()
            .filter((note) => self.openNoteIds.indexOf(note.id) > -1) // Get only notes whose ID is in the openNoteIds array
            .sort(function(note1, note2)
            {
                return -1 * note1.openTime().diff(note2.openTime()); // Sort by open time (most recently opened first)
            }
        );
    });

    self.searchResults = ko.pureComputed(function() {
        if (typeof(self.searchQuery()) == "undefined" || self.searchQuery() == "") return [];
        return self.notes().filter((note) => {
            return note.title().toLowerCase().indexOf(self.searchQuery().toLowerCase()) != -1 || (typeof(note.tags()) !== "undefined" && note.tags().indexOf(self.searchQuery().toLowerCase()) != -1);
        });
    });

    // Operations
    self.ClearSearch = function()
    {
        self.searchQuery("");
    }

    self.OpenNote = function(note)
    {
        if (self.openNoteIds.indexOf(note.id) == -1) {
            note.openTime(moment());
            self.openNoteIds.push(note.id);

            var openNoteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.openNoteIds));
            if (openNoteIds == null) {
                openNoteIds = [];
            }
            if (openNoteIds.indexOf(note.id) == -1) {
                openNoteIds.push(note.id);
                localStorage.setItem(config.storageKeys.openNoteIds, ko.toJSON(openNoteIds));
            }
        }
    }

    self.CloseNote = function(note)
    {
        self.openNoteIds.remove(note.id);

        var openNoteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.openNoteIds));
        if (openNoteIds != null) {
            var removeIndex = openNoteIds.indexOf(note.id);
            if (removeIndex > -1) {
                openNoteIds.splice(removeIndex, 1);
                localStorage.setItem(config.storageKeys.openNoteIds, ko.toJSON(openNoteIds));
            }
        }
    }

    self.CreateNote = function()
    {
        var newNote = new Note("Note " + moment().format("MMM. Qo, YYYY h:mma"));
        self.notes.push(newNote);
        self.SaveNote(newNote);
        self.OpenNote(newNote);
    }

    self.DeleteNote = function(noteToDelete)
    {
        // Close note
        self.CloseNote(noteToDelete);

        // Remove local storage data
        localStorage.removeItem(config.storageKeys.note + noteToDelete.id);
        var noteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.noteIds));
        if (noteIds != null) 
        {
            var removeIndex = noteIds.indexOf(noteToDelete.id);
            if (removeIndex > -1) {
                noteIds.splice(removeIndex, 1);
                localStorage.setItem(config.storageKeys.noteIds, ko.toJSON(noteIds));
            }
        }

        // Remove from notes list
        var removeIndex = self.notes().findIndex((note) => { return note.id == noteToDelete.id });
        self.notes.splice(removeIndex, 1);
    }

    self.SaveNote = function(note)
    {
        // Update the list of note IDs
        var currentNoteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.noteIds));
        if (currentNoteIds == null) {
            currentNoteIds = [];
        }
        if (currentNoteIds.indexOf(note.id) < 0) {
            currentNoteIds.push(note.id);
            localStorage.setItem(config.storageKeys.noteIds, ko.toJSON(currentNoteIds));
        }

        // Save the note
        localStorage.setItem(config.storageKeys.note + note.id, ko.toJSON(note));
    }

    self.SaveNotes = function() 
    {
        self.notes().forEach((note) => self.SaveNote(note));
    }

    self.LoadNotes = function()
    {
        var noteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.noteIds));
        if (noteIds != null)
        {
            noteIds.forEach((id) => {
                var noteJS = ko.utils.parseJson(localStorage.getItem(config.storageKeys.note + id));
                if (noteJS != null) {
                    var newNote = new Note();
                    newNote.FromJS(noteJS);
                    self.notes.push(newNote);
                }
            })
        }

        // Loading the list of open notes
        var openNoteIds = ko.utils.parseJson(localStorage.getItem(config.storageKeys.openNoteIds));
        if (openNoteIds == null) {
            openNoteIds = [];
        }

        self.openNoteIds(openNoteIds);
    }

    return self;
});