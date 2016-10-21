define(["knockout", "moment", "Model/NoteModel", "ViewModel/ControlPanelViewModel"], function(ko, moment, Note, ControlPanel)
{
    "use strict";
    var self = {};

    self.notes = ControlPanel.openNotes;
    self.pendingChanges = [];

    // Operations
    self.CloseNote = function(note)
    {
        ControlPanel.CloseNote(note);
    }

    self.EditNote = function(note)
    {
        var tagsString = note.tags() != undefined ? note.tags().join(", ") : "";        
        self.pendingChanges[note.id] = {
            title: ko.observable(note.title()),
            content: ko.observable(note.content()),
            tags: ko.observable(tagsString)
        };

        note.editing(true);
    }

    self.CancelEdit = function(note)
    {
        self.pendingChanges[note.id] = null;
        note.editing(false);
    }

    self.SaveEdit = function(note)
    {
        note.updated(moment());
        note.title(self.pendingChanges[note.id].title());
        note.content(self.pendingChanges[note.id].content());
        note.tags(self.pendingChanges[note.id].tags().split(",").map((tag) => tag.trim()))

        self.pendingChanges[note.id] = null;

        note.editing(false);
        ControlPanel.SaveNotes();
    }

    self.DeleteNote = function(note)
    {
        ControlPanel.DeleteNote(note);
    }

    return self;
});