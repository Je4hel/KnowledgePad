define(["knockout", "moment", "config", "markdown"], function(ko, moment, config, markdown)
{
    "use strict";

    var Note = function(title, content = "")
    {
        var self = this;
        self.id = Date.now();
        self.title = ko.observable("Untitled Note");
        self.content = ko.observable("");
        self.tags = ko.observableArray([]);
        self.created = moment();
        self.updated = ko.observable(moment());
        self.openTime = ko.observable();
        self.editing = ko.observable(false);

        // Computed properties
        self.relativeCreated = ko.computed(function() {
            var daysDiff = self.created.diff(config.rightNow(), "days");
            if (daysDiff > -1)
                return self.created.from(config.rightNow());
            else if (daysDiff == -1)
                return "yesterday";
            else if (daysDiff > -7)
                return self.created.format("on dddd");
            else
                return self.created.format("on MMM. Do");
        });

        self.relativeUpdated = ko.computed(function() {
            var daysDiff = self.updated().diff(config.rightNow(), "days");
            if (daysDiff > -1)
                return self.updated().from(config.rightNow());
            else if (daysDiff == -1)
                return "yesterday";
            else if (daysDiff > -7)
                return self.updated().format("on dddd");
            else
                return self.updated().format("on MMM. Do");
        });
        
        self.htmlContent = ko.pureComputed(function() {
            return markdown.toHTML(self.content());
        })
        
        // Initialize with input values
        if (title != "" && typeof(title) != "undefined") {
            self.title(title);
        }

        if (typeof(content) != "undefined") {
            self.content(content);
        }

        // Operations
        self.AddTag = function(tag)
        {
            if (self.tags.indexOf(tag) == -1) {
                self.tags.push(tag);
            }
        }

        self.RemoveTag = function(tag)
        {
            var removeIndex = self.tags.indexOf(tag);
            if (removeIndex != -1) {
                self.tags.splice(removeIndex, 1);
            }
        }

        self.FromJS = function(jsObj)
        {
            self.id = jsObj.id;
            self.title(jsObj.title);
            self.content(jsObj.content);
            self.tags(jsObj.tags);
            self.created = moment(jsObj.created);
            self.updated(moment(jsObj.updated));
            self.openTime(moment(jsObj.openTime));
            self.editing(false);

            return self;
        }
    }

    return Note;
});