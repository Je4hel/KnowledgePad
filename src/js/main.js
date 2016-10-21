require.config({
    paths: {
        jquery: "lib/jquery-3.1.0.min",
        knockout: "lib/knockout.3.4.0",
        moment: "lib/moment.min",
        markdown: "lib/markdown.min"
    },

    shim: {
        markdown: {
            exports: "markdown"
        }
    }
});

require(["jquery", "knockout", "ViewModel/WorkspaceViewModel", "ViewModel/ControlPanelViewModel"], function($, ko, WorkspaceViewModel, ControlPanelViewModel) {
    ko.applyBindings(WorkspaceViewModel, document.getElementById("workspace"));
    ko.applyBindings(ControlPanelViewModel, document.getElementById("control-panel"));

    ControlPanelViewModel.LoadNotes();
});