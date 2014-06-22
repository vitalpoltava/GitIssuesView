define(function(require) {
    'use strict';

    var itemView, noRecordsView;

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/issuesTableMainView.html');
    var ItemView = require('./issueRowView');
    var NoRecordsView = require('./noRecordsView');

    return Backbone.View.extend({
        template: template,

        initialize: function() {
            this.listenTo(this.collection, 'sync', this.renderTable.bind(this));
            this.render();
        },

        render: function() {
            this.$el.html(this.template({}));
            noRecordsView = new NoRecordsView({el: '.main_line .issues_rows'});
            return this;
        },

        renderTable: function() {
            itemView = new ItemView({el: '.main_line .issues_rows'});

            if (this.collection.length) {
                this.collection.forEach(function(model) {
                    itemView.render(model.toJSON());
                });
            } else {
                noRecordsView.render();
            }
        }
    });
});