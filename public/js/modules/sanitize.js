define(function(require) {
    'use strict';

    /**
     *  This module helps to sanitize string after user input
     *
     */
    return {
        sanitize: function(s) {
            return encodeURIComponent(this.stripTags(s));
        },

        sanitizeObject: function(obj) {
            for(var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    obj[prop] = this.sanitize(obj[prop]);
            }
            return obj;
        },

        stripTagsObject: function(obj) {
            for(var prop in obj) {
                if (obj.hasOwnProperty(prop))
                    obj[prop] = this.stripTags(obj[prop]);
            }
            return obj;
        },

        escapeObject: function(obj) {
            for(var prop in obj) {
                if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'string')
                    obj[prop] = this.escapeString(obj[prop]);
            }
            return obj;
        },

        escapeString: function(str) {
            return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
        },

        stripTags: function(str) {
            return str.replace(/(<([^>]+)>)/ig, '');
        }
    };
});