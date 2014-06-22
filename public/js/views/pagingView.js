define(function(require) {
    'use strict';

    var timer;
    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/pagingView.html');

    return Backbone.View.extend({
        template: template,

        initialize: function(options) {
            this.render(1)
                .addEvents();
        },

        render: function(page) {
            this.$el.html(this.template({page: page}));
            this.$next = this.$el.find('.go_next');
            this.$prev = this.$el.find('.go_prev');
            this.$pageNumber = this.$el.find('.page_number');
            return this;
        },

        refreshPageNumber: function(page) {
            this.$pageNumber.text(page);
        },

        addEvents: function() {
            var that = this;

            this.$next.click(function() {
                that.trigger('nextPageClick');
            });

            this.$prev.click(function() {
                that.trigger('prevPageClick');
            });
        }
    });
});