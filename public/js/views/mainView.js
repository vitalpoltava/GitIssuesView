define(function(require) {
    'use strict';

    var formView;

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/mainView.html');
    var FormView = require('./formView');

    return Backbone.View.extend({
        template: template,
        el: '#main',
        templateModel: {},

        initialize: function() {
            this.render();
        },

        render: function() {
            this.$el.html(this.template(this.templateModel));

            // applying sub-views
            formView = new FormView({el: '.main_line .left'});

            return this;
        }
    });
});