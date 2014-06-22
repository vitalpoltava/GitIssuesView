define(function(require) {
    'use strict';

    var formView;

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/itemsPerPageView.html');

    return Backbone.View.extend({
        template: template,
        templateModel: {},

        initialize: function() {
            this.render()
                .addEvents();
        },

        render: function() {
            this.$el.html(this.template(this.templateModel));
            this.$selector = $('.issues_per_page');
            return this;
        },

        addEvents: function() {
            this.$selector.change(this.broadcastChangeEvent.bind(this));
        },

        broadcastChangeEvent: function() {
            this.trigger('perPageNumberChanged');
        },

        getCurrentValue: function() {
            return parseInt(this.$selector.val(), 10);
        }
    });
});