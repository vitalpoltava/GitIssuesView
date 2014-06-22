define(function(require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/issueRowView.html');
    var sanitize = require('../modules/sanitize');

    return Backbone.View.extend({
        template: template,

        initialize: function() {
            this.$el.empty();
        },

        render: function(obj) {
            this.$el.append(this.template(sanitize.escapeObject(obj)));
            return this;
        }
    });
});