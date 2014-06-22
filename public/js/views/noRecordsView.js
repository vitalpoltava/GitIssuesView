define(function(require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/noRecords.html');

    return Backbone.View.extend({
        template: template,

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template({}));
            return this;
        }
    });
});