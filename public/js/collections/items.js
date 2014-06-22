define(function(require) {
    'use strict';

    var _ = require('underscore');
    var Backbone = require('backbone');
    var Item = require('../models/item');

    return Backbone.Collection.extend({
        model: Item,
        url: function() {
            return 'https://api.github.com/repos/'+ this.owner +'/'+ this.repo +'/issues?page='+ this.page +'&per_page=' + this.per_page;
        },

        search: function(owner, repo, page, per_page) {
            var that = this;

            if (!owner || !repo) this.trigger('RequiredFieldsEmptyInCollection');
            this.owner = owner;
            this.repo = repo;
            this.page = page || 1;
            this.per_page = per_page || 10;

            this.fetch({
                timeout: 10000, // request timeout
                error: function(collection, response){
                    var err = JSON.parse(response.responseText).message || 'Unexpected error happened';
                    that.trigger("SearchResultsError", err);
                },
                success: that.filterData.bind(that)
            });
        },

        filterData: function(collection) {
            var that = this;
            collection.forEach(function(model) {
                that.handleDateField(model);
            });
        },

        handleDateField: function(model) {
            var dateObj = new Date(model.get('created_at'))
            model.set({created_at: dateObj.toUTCString()})
        }
    });
});