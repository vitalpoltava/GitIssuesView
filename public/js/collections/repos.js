define(function(require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var Item = require('../models/repo');

    return Backbone.Collection.extend({
        model: Item,
        url: function() {
            return 'https://api.github.com/users/'+ this.owner +'/repos';
        },

        search: function(owner) {
            var that = this;
            this.owner = owner;

            this.fetch({
                timeout: 10000, // request timeout
                success: that.filterCollection.bind(that)
            });
        },

        /**
         * We will keep only required fields
         *
         * @param collection
         */
        filterCollection: function(collection) {
            var filtered = [];
            collection.forEach(function(model) {
                filtered.push({value: model.get('name')});
            });

            collection.reset(filtered);
        }
    });
});