define(function(require) {
    'use strict';

    var errorView, items, paginator, tableView, repos, pagingView;

    var _ = require('underscore');
    var Backbone = require('backbone');
    var template = require('jst!../templates/formView.html');
    var ErrorView = require('./errorView');
    var Items = require('../collections/items');
    var Repos = require('../collections/repos');
    var Paginator = require('./itemsPerPageView');
    var TableView = require('./issuesTableMainView');
    var PagingView = require('./pagingView');
    var sanitize = require('../modules/sanitize');
    var typeahead = require('typeahead');

    return Backbone.View.extend({
        template: template,
        templateModel: {},
        page: 1, // initial page number

        initialize: function() {
            items = new Items(); // init issues collection
            repos = new Repos(); // init repositories collection

            this.render()
                .addEvents();
        },

        render: function() {
            this.$el.html(this.template(this.templateModel));
            this.$searchEl = $('.search_issues');
            this.fieldsToBeValidated = [$('.input_git_name'), $('.input_repo_name')];

            // init sub-views
            paginator = new Paginator({el: '.pagination_number_row'});
            tableView = new TableView({el: '.main_line .issues_table_header', collection: items});
            pagingView = new PagingView({el: '.main_line .paging_view'});

            return this;
        },

        addEvents: function() {
            var that = this;

            // validate required fields in view and fetch the records
            this.$searchEl.click(this.validateAndFetch.bind(this));

            // Handle 'Enter' key press to start searching
            this.fieldsToBeValidated.forEach(function($input) {
                $input.keyup(that.checkEnterPress.bind(that));
            });

            // validate required fields in collection
            this.listenTo(items, 'RequiredFieldsEmptyInCollection', this.showEmptyError.bind(this));

            // search result error
            this.listenTo(items, 'SearchResultsError', this.handleSearchError.bind(this));

            // enable button after search is performed
            this.listenTo(items, 'sync SearchResultsError', this._toggleSearchButton.bind(this, false));

            // re-fetch when changing per page issues number
            this.listenTo(paginator, 'perPageNumberChanged', this.validateAndFetch.bind(this));

            // fetch all repos for user
            this._getOwnerInputField().blur(this.initAutoSuggest.bind(this));

            // populate auto-suggest with data
            this.listenTo(repos, 'reset', this.addAutoSuggestData.bind(this));

            // load next page of issues
            this.listenTo(pagingView, 'nextPageClick', this.nextPageLoad.bind(this));

            // load previous page of issues
            this.listenTo(pagingView, 'prevPageClick', this.prevPageLoad.bind(this));

            return this;
        },

        /**
         *  Load NEXT page
         */
        nextPageLoad: function() {
            if (!items.length || items.length < paginator.getCurrentValue()) return; // no reason to go next
            this.page += 1;
            this.validateAndFetch();
            pagingView.refreshPageNumber(this.page);
        },

        /**
         *  Load PREV page
         */
        prevPageLoad: function() {
            if (this.page === 1) return;
            this.page -= 1;
            this.validateAndFetch();
            pagingView.refreshPageNumber(this.page);
        },

        /**
         *  Load repos for auto suggest purposes
         */
        initAutoSuggest: function() {
            this.markRepoFieldLoading(true);
            repos.search(this._getOwnerName());
        },

        /**
         *  Init auto suggest plugin (or update suggestions)
         */
        addAutoSuggestData: function() {
            var that = this;

            // init auto-suggest
            if (!this.bhRepos) {
                this.bhRepos = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    // `states` is an array of state names defined in "The Basics"
                    local: repos.toJSON()
                });
                this.bhRepos.initialize();

                this._getReposInputField().typeahead({
                        hint: false,
                        highlight: true,
                        minLength: 1
                    },
                    {
                        name: 'states',
                        displayKey: 'value',
                        source: this.bhRepos.ttAdapter()
                    })
                    .on('typeahead:selected', function(){
                        that.validateAndFetch();
                    }
                );
            } else {
                // reset store if store is already here
                this.bhRepos.clear();
                this.bhRepos.add(repos.toJSON());
            }
            this.markRepoFieldLoading(false);
            this._getReposInputField().focus();
        },

        /**
         *  Check for ENTER press to start searching
         *
         * @param event
         */
        checkEnterPress: function(event) {
            // Check Enter key press
            if (event.which == 13 || event.keyCode == 13) {
                this.validateAndFetch();
            }
        },

        /**
         *  Main entry point to start searching
         */
        validateAndFetch: function() {
            if (this.validateForm()) this.fetchIssues();
        },

        fetchIssues: function() {
            this._toggleSearchButton(true);
            items.search(this._getOwnerName(), this._getRepoName(), (this.page || 1), paginator.getCurrentValue());
        },

        validateForm: function() {
            return this.checkEmpty();
        },

        checkEmpty: function() {
            var valid = true;
            // check empty validation
            this.fieldsToBeValidated.forEach(function($el) {
                if (!$el.val()) valid = false;
            });

            if (!valid) this.showEmptyError(valid);
            return valid;
        },

        /**
         *  Handling ERRORS
         */

        handleSearchError: function(errMsg) {
            this.showError(errMsg);
            items.reset(); // remove models (if any)
            tableView.render(); // reset table view
        },

        showEmptyError: function(valid) {
            this.showError('Both input fields are required');
        },

        showError: function(msg) {
            errorView = new ErrorView({el: '.form_error', error: msg});
        },

        /**
         *  Helpers: aux methods
         */

        markRepoFieldLoading: function(flag) {
            this._getReposInputField().toggleClass('loading_input', flag);
        },

        _toggleSearchButton: function(flag) {
            this.$searchEl.toggleClass('disabled', flag);
        },

        _getOwnerName: function() {
            return sanitize.sanitize( this._getOwnerInputField().val() );
        },

        _getRepoName: function() {
            return sanitize.sanitize( this._getReposInputField().val() );
        },

        _getOwnerInputField: function() {
            return this.fieldsToBeValidated[0];
        },

        _getReposInputField: function() {
            return this.fieldsToBeValidated[1];
        }
    });
});