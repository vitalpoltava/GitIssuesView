define(function(require) {
    'use strict';

    var timer;
    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/errorView.html');

    return Backbone.View.extend({
        template: template,

        initialize: function(options) {
            this.delay = options.delay || 3000;
            this.errorObj = {error: options.error || 'Unknown error!'};
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.errorObj));
            this.$el.show();
            timer = setTimeout(this.hideError.bind(this), this.delay);
            return this;
        },

        hideError: function() {
            this.$el.hide().empty();
            clearTimeout(timer);
        }
    });
});